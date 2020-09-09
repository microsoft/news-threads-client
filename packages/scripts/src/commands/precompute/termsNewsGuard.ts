/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as fs from 'fs'
import { join } from 'path'
import parse from 'csv-parse'
import stringify from 'csv-stringify'
import mkdirp from 'mkdirp'
import transform from 'stream-transform'
import { trimDomain } from '../../util/domains'
import { getFileList, readFileRows } from '../../util/files'
import { createTokenizer, Tokenizer } from '../../util/tokenizer'

interface TermRecord {
	term: string
	count: number
	dates: Map<string, number>
}

// add any fields that we care about for partitioning
// we'll start by using the score to partition terms into buckets
interface NewsGuard {
	domain: string
	rating: string
}

async function processDocumentFile(
	filename: string,
	accumulator: Map<string, Map<string, TermRecord>>,
	tokenizer: Tokenizer,
	domains: Map<string, NewsGuard>,
	keywords: Set<string>,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const parser = parse({ delimiter: ',', columns: true, escape: '\\' })
		const input = fs.createReadStream(filename, { encoding: 'utf8' })

		const xform = transform((record: any, callback: any) => {
			callback(null, {
				docid: record._docid,
				title: record._title,
				domain: record._domain,
				date: record._publication_date.split('T')[0], // this should hold consistently for the day from our pipeline
			})
		})

		let count = 0
		xform.on('data', record => {
			count++

			const { date, domain } = record
			const rating = domains.get(trimDomain(domain))?.rating || 'U'

			const grams = tokenizer(record.title)

			const subaccumulator =
				accumulator.get(rating) || new Map<string, TermRecord>()

			const all = subaccumulator.get('__documents__') || {
				term: '__documents__',
				count: 0,
				dates: new Map<string, number>(),
			}
			all.count++
			const docDate = all.dates.get(date) || 0
			all.dates.set(date, docDate + 1)
			subaccumulator.set('__documents__', all)

			grams.forEach(gram => {
				// only accumulate grams that match our keywords of interest set
				if (keywords.has(gram)) {
					const term = subaccumulator.get(gram) || {
						term: gram,
						count: 0,
						dates: new Map<string, number>(),
					}
					term.count++
					const termDate = term.dates.get(date) || 0
					term.dates.set(date, termDate + 1)

					subaccumulator.set(gram, term)
				}
			})

			accumulator.set(rating, subaccumulator)
		})

		xform.on('end', () => {
			resolve(count)
		})

		input.pipe(parser).pipe(xform)
	})
}

async function loadNewsGuard(
	filename: string,
): Promise<Map<string, NewsGuard>> {
	const domains = (await readFileRows(filename, {
		transformer: (r: any, c) => {
			c(null, {
				domain: trimDomain(r.Domain),
				rating: r.Rating,
			})
		},
	})) as NewsGuard[]
	const domainHash = domains.reduce((acc, cur) => {
		acc.set(cur.domain, cur)
		return acc
	}, new Map<string, NewsGuard>())
	return domainHash
}

async function loadTargetTerms(filename: string): Promise<Set<string>> {
	const content = await fs.promises.readFile(filename, 'utf8')
	const words = JSON.parse(content) as string[]
	return words.reduce((acc, cur) => {
		// make sure the grams are sorted alpha so they match our tokenizer
		const sorted = cur.split(/\s/).sort().join(' ')
		acc.add(sorted)
		return acc
	}, new Set<string>())
}

async function processDocuments(
	dataDir: string,
	tokenizer: Tokenizer,
	domains: Map<string, NewsGuard>,
	keywords: Set<string>,
): Promise<Map<string, Map<string, TermRecord>>> {
	const files = await getFileList(dataDir, 'documents', '.csv')

	console.log(`files: ${files[0]} + ${files.length - 1} more`)

	const accumulator = new Map<string, Map<string, TermRecord>>()

	let count = 0

	for (const filename of files) {
		const fileRecords = await processDocumentFile(
			filename,
			accumulator,
			tokenizer,
			domains,
			keywords,
		)
		count += fileRecords
		console.log(
			`${count} rows read, ${Math.round(
				process.memoryUsage().heapUsed / 1000000,
			)}mb memory`,
		)
	}

	console.log('documents', count)

	return accumulator
}

async function writeByTermOutput(
	rootPath: string,
	byRating: Map<string, Map<string, TermRecord>>,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const filename = join(rootPath, 'daily_counts_by_rating.csv')

		const output = fs.createWriteStream(filename)
		const stringifier = stringify()

		let lines = 0

		output.on('finish', () => {
			resolve(lines)
		})

		stringifier.pipe(output)

		stringifier.write(['date', 'rating', 'text', 'count'])

		byRating.forEach((ratingMap, rating) => {
			ratingMap.forEach((termRecord, term) => {
				termRecord.dates.forEach((count, date) => {
					lines++
					stringifier.write([date, rating, term, count])
				})
			})
		})

		stringifier.end()
	})
}

// this runs a simple cross-check to add up our maps
// it just provides a sanity check that we've partitioned correctly
// by rating and date, and that when rolled back up they still match
function verify(byRating: Map<string, Map<string, TermRecord>>) {
	const documents: any = {
		T: 0,
		N: 0,
		S: 0,
		P: 0,
		U: 0,
		total: 0,
		cross: 0,
	}
	const grams: any = {
		T: 0,
		N: 0,
		S: 0,
		P: 0,
		U: 0,
		total: 0,
		cross: 0,
	}

	byRating.forEach((ratingMap, rating) => {
		ratingMap.forEach((termRecord, term) => {
			const which = term === '__documents__' ? documents : grams
			which.cross += termRecord.count
			termRecord.dates.forEach(count => {
				which[rating] += count
				which.total += count
			})
		})
	})

	console.log('total documents breakdown by rating', documents)
	console.log('grams breakdown by rating', grams)
}

/**
 * This script is the same as the regular terms one, except that it adds
 * an additional partitioning layer by NewsGuard rating
 * T: Trustworthy
 * N: Not Trustworthy
 * S: Satire (unrated)
 * P: Platform (unrated)
 * U: Unrated, meaning NewsGuard did not have an entry
 * TODO: merge sharable content with the other script with a generic partitioning approach?
 *
 * It also focuses on a limited  subset of defined keywords (array of strings in keywords.json file)
 * to reduce processing memory and output file size.
 * @param dataset
 * @param dataRoot
 * @param outputRoot
 */
export async function termsNewsGuard(
	dataset: string,
	dataRoot: string,
	outputRoot: string,
): Promise<number> {
	console.time('computing term stats')

	const dataDir = join(dataRoot, dataset)
	const outputDir = join(outputRoot, dataset)

	// note the placement of the domains.csv in out OUTPUT directory
	// this is because we rarely have read access to the input directory,
	// and this is sort of a "meta merge" with non-canonical data (in this case, NewsGuard)
	const [domains, keywords, tokenizer] = await Promise.all([
		loadNewsGuard(join(outputDir, 'domains.csv')),
		loadTargetTerms(join(outputDir, 'keywords.json')),
		createTokenizer({ grams: 2 }),
	])

	console.log(keywords)
	const byRating = await processDocuments(dataDir, tokenizer, domains, keywords)

	verify(byRating)

	await mkdirp(outputDir)
	// eslint-disable-next-line
	const lines = await writeByTermOutput(outputDir, byRating)

	console.log('written date/term rows', lines)
	console.timeEnd('computing term stats')
	return 0
}

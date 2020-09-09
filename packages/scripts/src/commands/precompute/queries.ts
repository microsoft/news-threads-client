/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as fs from 'fs'
import { join } from 'path'
import parse from 'csv-parse'
import stringify from 'csv-stringify'
import mkdirp from 'mkdirp'
import { utc, Moment, min, max } from 'moment'
import transform from 'stream-transform'
import { Dataset } from '../../types'
import { dateMap, dateToDayPrecision } from '../../util/date'
import { getFileList } from '../../util/files'
import { createTokenizer } from '../../util/tokenizer'

interface TermRecord {
	term: string
	count: number
	dates: Map<string, number>
}

async function processQueryFile(
	filename: string,
	accumulator: Map<string, TermRecord>,
	dateRange: [Date, Date],
	queryRange?: [Date, Date],
): Promise<number> {
	const tokenizer = await createTokenizer({
		grams: 2,
	})
	return new Promise((resolve, reject) => {
		// note the skip_lines_with_error flag
		// there is some 'dirty' content with quote characters and such
		// in the oss dataset. we'll just ignore them when they fail parsing
		const parser = parse({
			delimiter: '\t',
			columns: true,
			skip_lines_with_error: true,
		})
		const input = fs.createReadStream(filename, { encoding: 'utf8' })

		// we only care about the US for this analysis
		const filter = transform((record: any, callback: any) => {
			if (record.Country !== 'United States') {
				callback(null, null)
			} else {
				callback(null, record)
			}
		})

		const xform = transform((record: any, callback: any) => {
			const date = dateToDayPrecision(record.Date)
			callback(null, {
				date,
				query: record.Query,
				count: +record.NumQueries,
			})
		})

		let counts = 0

		xform.on('data', record => {
			counts++

			const { date, query, count } = record

			const tokens = tokenizer(query)
			if (counts < 2) {
				console.log(record)
				console.log(tokens)
			}

			tokens.forEach(token => {
				const term = accumulator.get(token) || {
					term: token,
					count: 0,
					dates: dateMap(dateRange, queryRange),
				}
				term.count += count
				const termDate = term.dates.get(date) || -1
				if (termDate < 0) {
					term.dates.set(date, count)
				} else {
					term.dates.set(date, termDate + count)
				}

				accumulator.set(token, term)
			})
		})

		xform.on('end', () => {
			resolve(counts)
		})

		input.pipe(parser).pipe(filter).pipe(xform)
	})
}

// parses the filename format from bing and find the stated date range
function discoverFileDates(files: string[]): [Date, Date] {
	const parsed = files.reduce((acc, cur) => {
		// format is 'QueriesByCountry_<start>_<stop>.tsv
		const [, start, stop] = cur.split(/[_.]/)
		const startDate = utc(start)
		const stopDate = utc(stop)
		return [...acc, startDate, stopDate]
	}, [] as Moment[])
	const first = min(parsed)
	const last = max(parsed)
	return [first.toDate(), last.toDate()]
}

async function processQueries(
	dataDir: string,
	dateRange: [Date, Date],
): Promise<Map<string, TermRecord>> {
	const files = await getFileList(dataDir, 'queries')
	console.log(`files: ${files[0]} + ${files.length - 1} more`)

	const queryRange = discoverFileDates(files)

	console.log(
		`dataset date range: ${dateRange}, query extraction date range: ${queryRange}`,
	)

	const accumulator = new Map<string, TermRecord>()

	let count = 0

	for (const filename of files) {
		console.log('loading file', filename)
		const fileRecords = await processQueryFile(
			filename,
			accumulator,
			dateRange,
			queryRange,
		)
		count += fileRecords
		console.log(
			`${fileRecords} file rows -> ${count} total rows, ${Math.round(
				process.memoryUsage().heapUsed / 1000000,
			)}mb memory`,
		)
	}

	console.log('rows', count)

	return accumulator
}

// this normalizes each query against the total query count for the day.
// this is effectively a ranking, which is more useful for statistical analysis.
// it essentially replicates the popularity score, but with greater precision
function normalizeQueriesDaily(accumulator: Map<string, TermRecord>) {
	// first get the total count of queries per day
	const sums = new Map<string, number>()
	accumulator.forEach(record => {
		record.dates.forEach((count, date) => {
			const d = sums.get(date) || 0
			sums.set(date, d + count)
		})
	})
	let max = 0
	accumulator.forEach(record => {
		record.dates.forEach((count, date) => {
			const sum = sums.get(date) || 0
			max = Math.max(max, sum)
			if (sum > 0) {
				const norm = Math.round((count / sum) * 100000) / 100000
				record.dates.set(date, norm)
			}
		})
	})
	// add a final entry for the total query count per day
	// use __documents__ to match what we did for article terms,
	// so we get matching hits
	const norms = new Map<string, number>()
	let total = 0
	sums.forEach((sum, date) => {
		if (sum > 0) {
			total += sum
			norms.set(date, Math.round((sum / max) * 100000) / 100000)
		} else if (sum === 0) {
			norms.set(date, 0)
		} else {
			norms.set(date, -1)
		}
	})
	accumulator.set('__documents__', {
		term: '__documents__',
		count: total,
		dates: norms,
	})
}

async function writeByTermOutput(
	rootPath: string,
	byTerm: Map<string, TermRecord>,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const filename = join(rootPath, 'PRECOMPUTE_query_counts.csv')

		const output = fs.createWriteStream(filename)
		const stringifier = stringify()

		let lines = 0

		output.on('finish', () => {
			resolve(lines)
		})

		stringifier.pipe(output)

		stringifier.write(['date', 'text', 'count'])

		byTerm.forEach((termRecord, term) => {
			termRecord.dates.forEach((count, date) => {
				lines++
				stringifier.write([date, term, count])
			})
		})

		stringifier.end()
	})
}

export async function queries(
	dataset: string,
	dataRoot: string,
	outputRoot: string,
): Promise<number> {
	console.time('computing query stats')

	const dataDir = join(dataRoot, dataset)
	const outputDir = join(outputRoot, dataset)
	// pulling in the date range from the dataset to establish when
	// a query token is 0 hits on a day versus no data, because the query
	// data is updated at a separate cadence from our datasets
	/* eslint-disable-next-line @typescript-eslint/no-var-requires */
	const meta: Dataset = require(join(dataDir, 'dataset.json'))
	const dateRange: [Date, Date] = [
		new Date(meta.startDate),
		new Date(meta.endDate),
	]

	const byTerm = await processQueries(dataDir, dateRange)
	console.log(byTerm.get('china')?.dates)

	normalizeQueriesDaily(byTerm)
	// normalizeQueries(byTerm)

	console.log(byTerm.size, 'keys')
	console.log(byTerm.get('china')?.dates)

	await mkdirp(outputDir)
	// eslint-disable-next-line
	const lines = await writeByTermOutput(outputDir, byTerm)

	console.log('written date/term rows', lines)
	console.timeEnd('computing query stats')
	return 0
}

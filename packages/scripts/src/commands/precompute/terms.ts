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
import { getFileList } from '../../util/files'
import { createTokenizer, Tokenizer } from '../../util/tokenizer'

interface TermRecord {
	term: string
	count: number
	dates: Map<string, number>
}

async function processDocumentFile(
	filename: string,
	accumulator: Map<string, TermRecord>,
	tokenizer: Tokenizer,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const parser = parse({ delimiter: ',', columns: true, escape: '\\' })
		const input = fs.createReadStream(filename, { encoding: 'utf8' })

		const xform = transform((record: any, callback: any) => {
			callback(null, {
				docid: record._docid,
				title: record._title,
				date: record._publication_date.split('T')[0], // this should hold consistently for the day from our pipeline
			})
		})

		let count = 0
		xform.on('data', record => {
			count++

			const { date } = record

			const grams = tokenizer(record.title)

			const all = accumulator.get('__documents__') || {
				term: '__documents__',
				count: 0,
				dates: new Map<string, number>(),
			}
			const docDate = all.dates.get(date) || 0
			all.dates.set(date, docDate + 1)
			accumulator.set('__documents__', all)

			grams.forEach(gram => {
				const term = accumulator.get(gram) || {
					term: gram,
					count: 0,
					dates: new Map<string, number>(),
				}
				term.count++
				const termDate = term.dates.get(date) || 0
				term.dates.set(date, termDate + 1)

				accumulator.set(gram, term)
			})
		})

		xform.on('end', () => {
			resolve(count)
		})

		input.pipe(parser).pipe(xform)
	})
}

async function processDocuments(
	dataDir: string,
	tokenizer: Tokenizer,
): Promise<Map<string, TermRecord>> {
	const files = await getFileList(dataDir, 'documents', '.csv')
	console.log(`files: ${files[0]} + ${files.length - 1} more`)

	const accumulator = new Map<string, TermRecord>()

	let count = 0

	for (const filename of files) {
		const fileRecords = await processDocumentFile(
			filename,
			accumulator,
			tokenizer,
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
	byTerm: Map<string, TermRecord>,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const filename = join(rootPath, 'daily_counts.csv')

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

export async function terms(
	dataset: string,
	dataRoot: string,
	outputRoot: string,
): Promise<number> {
	console.time('computing term stats')

	const dataDir = join(dataRoot, dataset)
	const outputDir = join(outputRoot, dataset)

	const tokenizer = await createTokenizer({ grams: 2 })

	const byTerm = await processDocuments(dataDir, tokenizer)

	//eslint-disable-next-line
	await mkdirp(outputDir)
	const lines = await writeByTermOutput(outputDir, byTerm)

	console.log('written date/term rows', lines)
	console.timeEnd('computing term stats')
	return 0
}

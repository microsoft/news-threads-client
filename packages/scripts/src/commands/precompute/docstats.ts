/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'csv'
import * as fs from 'fs'
import { resolve, basename } from 'path'
import parse from 'csv-parse'
import stringify from 'csv-stringify'
import mkdirp from 'mkdirp'
import transform from 'stream-transform'
import { getFileList } from '../../util/files'
import { getCollectionColumns } from '../../util/getCollectionColumns'

const DOCSEARCH_COLLECTION = 'PRECOMPUTE_docsearch'
const DOCSTATS_COLLECTION = 'PRECOMPUTE_docstats'

const NORMALIZE_COLUMNS = ['instanceVariantRatio', 'instanceDuplicateRatio']

interface NormalizeRange {
	min: number
	max: number
}

function normalizeValue(value: number, { min, max }: NormalizeRange) {
	return (value - min) / (max - min)
}

async function processDocsearchFile(
	filename: string,
	accumulator: Array<Record<string, any>>,
	aggregateInfo: Map<string, NormalizeRange>,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const parser = parse({
			delimiter: ',',
			columns: true,
			skip_lines_with_error: true,
		})
		const input = fs.createReadStream(filename, { encoding: 'utf8' })

		const xform = transform((record: any, callback: any) => {
			callback(null, record)
		})

		let counts = 0

		xform.on('data', record => {
			counts++

			for (const [column, rangeInfo] of aggregateInfo.entries()) {
				const recordValue = Number.parseFloat(record[column])
				rangeInfo.min = Math.min(
					rangeInfo.min,
					Number.isNaN(recordValue) ? Number.POSITIVE_INFINITY : recordValue,
				)
				rangeInfo.max = Math.max(
					rangeInfo.max,
					Number.isNaN(recordValue) ? Number.NEGATIVE_INFINITY : recordValue,
				)
			}
		})

		xform.on('end', () => {
			resolve(counts)
		})

		input.pipe(parser).pipe(xform)
	})
}

async function processDocsearch(
	dataDir: string,
): Promise<Map<string, NormalizeRange>> {
	const files = await getFileList(dataDir, 'docsearch.csv')
	console.log(`files: ${files[0]} + ${files.length - 1} more`)

	const accumulator: Array<Record<string, any>> = []
	const aggregateInfo: Map<string, NormalizeRange> = new Map<
		string,
		NormalizeRange
	>()

	for (const normalizeColumn of NORMALIZE_COLUMNS) {
		aggregateInfo.set(normalizeColumn, {
			min: Number.POSITIVE_INFINITY,
			max: Number.NEGATIVE_INFINITY,
		})
	}

	let count = 0

	for (const filename of files) {
		console.log('loading file ', filename)
		const fileRecords = await processDocsearchFile(
			filename,
			accumulator,
			aggregateInfo,
		)
		count += fileRecords
		console.log(
			`${fileRecords} file rows -> ${count} total rows, ${Math.round(
				process.memoryUsage().heapUsed / 1000000,
			)}mb memory`,
		)
	}

	console.log('rows', count)

	return aggregateInfo
}

async function writeFile(
	filename: string,
	dataRoot: string,
	columns: string[],
	aggregateInfo: Map<string, NormalizeRange>,
): Promise<number> {
	return new Promise((resolve, reject) => {
		console.log('writing ', filename)
		const parser = parse({
			delimiter: ',',
			columns: true,
			skip_lines_with_error: true,
		})
		const input = fs.createReadStream(dataRoot, { encoding: 'utf8' })

		const xform = transform((record: any, callback: any) => {
			callback(null, record)
		})

		let lines = 0
		xform.on('data', row => {
			lines++
			for (const [column, rangeInfo] of aggregateInfo.entries()) {
				const ratioValue = Number.parseFloat(row[column])
				row[column] = normalizeValue(
					isNaN(ratioValue) ? 0 : ratioValue,
					rangeInfo,
				)
			}
		})

		const output = fs.createWriteStream(filename)
		const stringifier = stringify({
			header: true,
			columns: columns.reduce((acc, cur) => {
				return { ...acc, [cur]: cur }
			}, {}),
		})

		output.on('finish', () => {
			console.log(`Wrote ${lines} to ${filename}`)
			resolve(lines)
		})

		input.pipe(parser).pipe(xform).pipe(stringifier).pipe(output)
	})
}

async function writeOutput(
	dataDir: string,
	outputDir: string,
	aggregateInfo: Map<string, NormalizeRange>,
): Promise<number[]> {
	await mkdirp(outputDir)
	const docsearch = resolve(outputDir, 'PRECOMPUTE_docsearch.csv')
	const docstats = resolve(outputDir, 'PRECOMPUTE_docstats.csv')
	const docsearchColumns = getCollectionColumns(DOCSEARCH_COLLECTION)
	const docstatsColumns = getCollectionColumns(DOCSTATS_COLLECTION)

	const files = await getFileList(dataDir, 'docsearch.csv')

	const results: number[] = []

	const createFiles = []
	if (!fs.existsSync(docsearch)) {
		createFiles.push(fs.promises.mkdir(docsearch, { recursive: true }))
	}

	if (!fs.existsSync(docstats)) {
		createFiles.push(fs.promises.mkdir(docstats, { recursive: true }))
	}

	await Promise.all(createFiles)

	for (const filename of files) {
		const base = basename(filename)

		const newResults = await Promise.all([
			writeFile(
				resolve(docsearch, base),
				filename,
				docsearchColumns,
				aggregateInfo,
			),
			writeFile(
				resolve(docstats, base),
				filename,
				docstatsColumns,
				aggregateInfo,
			),
		])
		results.push(...newResults)
	}

	return results
}

export async function docstats(
	dataset: string,
	dataRoot: string,
	outputRoot: string,
): Promise<number> {
	console.time('computing doc stats')
	const dataDir = resolve(dataRoot, dataset)
	const outputDir = resolve(outputRoot, dataset)

	console.log(`Read data from: ${dataDir}`)
	console.log(`Output computed data to: ${outputDir}`)

	const aggregateInfo = await processDocsearch(dataDir)
	console.log(JSON.stringify(Array.from(aggregateInfo.entries()), undefined, 2))
	await writeOutput(dataDir, outputDir, aggregateInfo)
	console.timeEnd('computing doc stats')
	return 0
}

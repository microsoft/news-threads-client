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
import { dateToDayPrecision } from '../../util/date'

function makeParser() {
	// note the skip_lines_with_error flag
	// there is some 'dirty' content with quote characters and such
	// in the oss dataset. we'll just ignore them when they fail parsing
	return parse({
		delimiter: '\t',
		columns: true,
		skip_lines_with_error: true,
	})
}

// make a consistent compound key to ensure counts are partitioned by geography for each day
function geoKey(record: any) {
	return `${record.Date}::${record.Country}::${record.State}`
}

async function normalizeFile(
	inputFile: string,
	outputFile: string,
	dailyCounts: Map<string, number>,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const parser = makeParser()
		const input = fs.createReadStream(inputFile, { encoding: 'utf8' })
		const output = fs.createWriteStream(outputFile)
		const xform = transform((record: any, callback: any) => {
			const key = geoKey(record)
			const dayTotal = dailyCounts.get(key) as number
			// intentionally exclude the raw values
			const { NumQueries, NumClients, ...fields } = record
			callback(null, {
				...fields,
				Date: dateToDayPrecision(record.Date),
				NormalizedCount: +record.NumQueries / dayTotal,
			})
		})

		const stringifier = stringify({
			header: true,
			delimiter: '\t',
		})

		output.on('finish', () => {
			resolve()
		})

		input.pipe(parser).pipe(xform).pipe(stringifier).pipe(output)
	})
}

/**
 * This just spins through the file counting up the queries by day for later normalizing
 * @param filename
 */
async function readDailyCounts(filename: string): Promise<Map<string, number>> {
	return new Promise((resolve, reject) => {
		const accumulator = new Map<string, number>()
		const input = fs.createReadStream(filename, { encoding: 'utf8' })
		const parser = makeParser()
		parser.on('data', record => {
			const { NumQueries } = record
			const key = geoKey(record)
			const dayCount = accumulator.get(key) || 0
			accumulator.set(key, dayCount + +NumQueries)
		})
		parser.on('end', () => {
			resolve(accumulator)
		})
		input.pipe(parser)
	})
}

async function processQueries(dataDir: string, outputDir: string) {
	const items = await fs.promises.readdir(dataDir)
	const files = items.filter(d => fs.statSync(join(dataDir, d)).isFile())
	console.log(`files: ${files[0]} + ${files.length - 1} more`)
	for (const filename of files) {
		console.log('processing file', filename)
		const inFile = join(dataDir, filename)
		const outFile = join(outputDir, filename)
		const accumulator = await readDailyCounts(inFile)
		await normalizeFile(inFile, outFile, accumulator)
	}
}

/**
 * This reformats the raw queries from Narendra so they match
 * the format on GitHub but with higher precision.
 * The output value here is "NormalizedCount" instead of "PopularityScore".
 * They aren't quite the same metric, but normalized count is what you would
 * expect: for every query/day/geography, the count value is divided by the
 * total number of queries for that same day/geography. This effectively
 * provides a "rank" while obscuring raw counts.
 * @param dataset
 * @param dataRoot
 * @param outputRoot
 */
export async function queriesOss(
	dataset: string,
	dataRoot: string,
	outputRoot: string,
): Promise<number> {
	console.time('reformating oss queries')

	const dataDir = join(dataRoot, dataset, 'queries')
	const outputDir = join(outputRoot, dataset, 'queries', 'normalized')
	await mkdirp(outputDir)
	// eslint-disable-next-line @essex/adjacent-await
	await processQueries(dataDir, outputDir)

	console.timeEnd('reformating oss queries')
	return 0
}

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

async function processFragmentFile(
	filename: string,
	acc1: any,
	acc2: any,
): Promise<any> {
	return new Promise((resolve, reject) => {
		const parser = parse({ delimiter: ',', columns: true, escape: '\\' })
		const input = fs.createReadStream(filename, { encoding: 'utf8' })

		const xform = transform((record: any, callback: any) => {
			callback(null, {
				docid: record._docid || record.docid,
				sid: +(record._sentence_id || record.sent),
				sindex: +(record._document_sentence_index || record.sentnum),
				clusterId: +(record.sentence_cluster_id || record.sent),
				sourceId: +(record._source_sentence_id || record.sent),
			})
		})

		let count = 0
		xform.on('data', record => {
			count++

			const { clusterId, sourceId, sid } = record
			const accumulator = clusterId % 2 === 0 ? acc1 : acc2

			const existing = accumulator[clusterId] || {
				clusterId: clusterId,
				sourceId: sourceId,
				instanceCount: 0,
				variantHash: {},
			}

			const vh = existing.variantHash || {}
			const vhc = vh[sid] || 0
			vh[sid] = vhc + 1

			existing.variantHash = vh
			existing.instanceCount++

			accumulator[clusterId] = existing
		})

		xform.on('end', () => {
			resolve(count)
		})
		input.pipe(parser).pipe(xform)
	})
}

async function processFragmentSummaries(dataDir: string): Promise<any> {
	const files = await getFileList(dataDir, 'fragment_summaries', '.csv')
	console.log(`files: ${files[0]} + ${files.length - 1} more`)

	const acc1 = {}
	const acc2 = {}

	let count = 0
	for (const filename of files) {
		const fileRecords = await processFragmentFile(filename, acc1, acc2)
		count += fileRecords
		console.log(
			`${count} rows read, ${Math.round(
				process.memoryUsage().heapUsed / 1000000,
			)}mb memory`,
		)
	}

	console.log('records', count)

	return [acc1, acc2]
}

// write the computed data back out to a csv for regular pipeline ingest
async function writeClusterStats(
	rootPath: string,
	clusterHashes: Record<string, any[]>[],
): Promise<number> {
	return new Promise((resolve, reject) => {
		const filename = join(rootPath, 'sentence_cluster_summaries.csv')

		const output = fs.createWriteStream(filename)
		const stringifier = stringify()

		let count = 0

		output.on('finish', () => {
			resolve(count)
		})

		stringifier.pipe(output)

		stringifier.write([
			'clusterId',
			'sourceId',
			'instanceCount',
			'variantCount',
			'duplicateCount',
			'instanceVariantRatio',
			'instanceDuplicateRatio',
		])

		clusterHashes.forEach(clusterHash => {
			const keys = Object.keys(clusterHash)
			keys.forEach(key => {
				count++
				const entry = clusterHash[key]
				const { clusterId, sourceId, variantHash, instanceCount } = entry as any
				const variantCount = Object.keys(variantHash).length
				const duplicateCount = variantHash[sourceId] - 1
				stringifier.write([
					clusterId,
					sourceId,
					instanceCount,
					variantCount,
					duplicateCount,
					Math.round((instanceCount / variantCount) * 100) / 100,
					duplicateCount === 0
						? 0
						: Math.round((instanceCount / duplicateCount) * 100) / 100,
				])
			})
		})

		stringifier.end()
	})
}

export async function sentences(
	dataset: string,
	dataRoot: string,
	outputRoot: string,
): Promise<number> {
	console.time('computing sentence stats')
	const dataDir = join(dataRoot, dataset)
	const outputDir = join(dataRoot, dataset)
	const byCluster = await processFragmentSummaries(dataDir)
	await mkdirp(outputDir)
	const written = await writeClusterStats(outputDir, byCluster)
	console.log('written csv lines', written)
	console.timeEnd('computing sentence stats')
	return written
}

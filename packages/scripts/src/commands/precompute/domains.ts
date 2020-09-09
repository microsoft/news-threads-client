/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as fs from 'fs'
import { join } from 'path'
import parse from 'csv-parse'
import stringify from 'csv-stringify'
import transform from 'stream-transform'
import { getFileList } from '../../util/files'

interface DomainStats {
	domain: string
	score: number
	rating: string
	documents: number
	instanceCount: number
	variantCount: number
	duplicateCount: number
	instanceVariantRatio: number
	instanceDuplicateRatio: number
}

async function processDocumentsFile(
	filename: string,
	accumulator: Map<string, DomainStats>,
): Promise<any> {
	return new Promise((resolve, reject) => {
		const parser = parse({ delimiter: ',', columns: true, escape: '\\' })
		const input = fs.createReadStream(filename, { encoding: 'utf8' })

		const xform = transform((record: any, callback: any) => {
			callback(null, {
				domain: record.domain,
				instanceCount: +record.instanceCount,
				variantCount: +record.variantCount,
				duplicateCount: +record.duplicateCount,
				instanceVariantRatio: +record.instanceVariantRatio,
				instanceDuplicateRatio: +record.instanceDuplicateRatio,
				score: +record.domainScore,
				rating: record.domainRating,
			})
		})

		let count = 0
		xform.on('data', record => {
			count++
			const {
				domain,
				score,
				rating,
				instanceCount,
				variantCount,
				duplicateCount,
				instanceVariantRatio,
				instanceDuplicateRatio,
			} = record
			const data = accumulator.get(domain) || {
				domain,
				score,
				rating,
				documents: 0,
				instanceCount: 0,
				variantCount: 0,
				duplicateCount: 0,
				instanceVariantRatio: 0,
				instanceDuplicateRatio: 0,
			}

			data.documents++
			data.instanceCount += instanceCount
			data.variantCount += variantCount
			data.duplicateCount += duplicateCount
			// sum these - they will be turned into averages later
			data.instanceVariantRatio += instanceVariantRatio
			data.instanceDuplicateRatio += instanceDuplicateRatio

			accumulator.set(domain, data)
		})

		xform.on('end', () => {
			resolve(count)
		})
		input.pipe(parser).pipe(xform)
	})
}

async function writeDomainStats(
	rootPath: string,
	domains: Map<string, DomainStats>,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const filename = join(rootPath, 'PRECOMPUTE_domain_summaries.csv')

		const output = fs.createWriteStream(filename)
		const stringifier = stringify()

		let count = 0

		output.on('finish', () => {
			resolve(count)
		})

		stringifier.pipe(output)

		stringifier.write([
			'domain',
			'score',
			'rating',
			'documents',
			'instanceCount',
			'variantCount',
			'duplicateCount',
			'instanceVariantRatio',
			'instanceDuplicateRatio',
		])

		domains.forEach((data, domain) => {
			count++
			stringifier.write([
				domain,
				data.score,
				data.rating,
				data.documents,
				data.instanceCount,
				data.variantCount,
				data.duplicateCount,
				data.instanceVariantRatio,
				data.instanceDuplicateRatio,
			])
		})

		stringifier.end()
	})
}

async function processDocuments(dataDir: string): Promise<any> {
	const files = await getFileList(dataDir, 'docsearch', '.csv')
	console.log(`files: ${files[0]} + ${files.length - 1} more`)

	const domains = new Map<string, DomainStats>()

	let count = 0
	for (const filename of files) {
		const fileRecords = await processDocumentsFile(filename, domains)
		count += fileRecords
		console.log(
			`${count} rows read, ${Math.round(
				process.memoryUsage().heapUsed / 1000000,
			)}mb memory`,
		)
	}

	console.log('records', count)

	return domains
}

// this filters out domains with no instances, because it means we don't actually have document content
function filterDomainStats(domains: Map<string, DomainStats>) {
	domains.forEach((record, key) => {
		// note also the exclusion of domains with very few documents
		if (record.instanceCount === 0 || record.documents < 10) {
			domains.delete(key)
		}
	})
}

function normalizeDomainStats(domains: Map<string, DomainStats>) {
	let maxVR = 0
	let maxDR = 0
	// first convert the summed ratios to averages
	domains.forEach(record => {
		if (record.documents > 0) {
			record.instanceVariantRatio =
				record.instanceVariantRatio / record.documents
			maxVR = Math.max(maxVR, record.instanceVariantRatio)
			record.instanceDuplicateRatio =
				record.instanceDuplicateRatio / record.documents
			maxDR = Math.max(maxDR, record.instanceDuplicateRatio)
		} else {
			// sanity check
			record.instanceVariantRatio = 0
			record.instanceDuplicateRatio = 0
		}
	})
	// now normalize based on the top one
	domains.forEach(record => {
		record.instanceVariantRatio = record.instanceVariantRatio / maxVR
		record.instanceDuplicateRatio = record.instanceDuplicateRatio / maxDR
	})
}

export async function domains(
	dataset: string,
	dataRoot: string,
	outputRoot: string,
): Promise<number> {
	console.time('computing domain stats')
	const dataDir = join(dataRoot, dataset)
	const outputDir = join(outputRoot, dataset)
	const byDomain = await processDocuments(dataDir)
	filterDomainStats(byDomain)
	normalizeDomainStats(byDomain)
	const written = await writeDomainStats(outputDir, byDomain)
	console.log('written csv lines', written)
	console.timeEnd('computing domain stats')
	return written
}

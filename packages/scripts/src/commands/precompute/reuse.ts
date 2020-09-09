/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as fs from 'fs'
import { join } from 'path'
import parse from 'csv-parse'
import transform from 'stream-transform'
import { getFileList } from '../../util/files'
const fsp = fs.promises

interface Document {
	docid: string
	sentences: number[]
	sentenceHash: Hash<boolean>
	clusters: number[]
	clusterHash: Hash<boolean>
	unique?: boolean
}

interface Hash<T> {
	[key: string]: T
}

async function processFragmentFile(
	filename: string,
	documents: Hash<Document>,
): Promise<number> {
	return new Promise((resolve, reject) => {
		const parser = parse({ delimiter: ',', columns: true, escape: '\\' })
		const input = fs.createReadStream(filename, { encoding: 'utf8' })

		const xform = transform((record: any, callback: any) => {
			callback(null, {
				docid: record._docid,
				sid: +record._sentence_id,
				sindex: +record._document_sentence_index,
				clusterId: +record.sentence_cluster_id,
				sourceId: +record._source_sentence_id,
			})
		})

		let count = 0
		xform.on('data', record => {
			count++

			const { docid, sid, clusterId } = record

			const doc = documents[docid] || {
				docid,
				// sentences are using exact match, so this assesses exact duplication
				sentences: [],
				sentenceHash: {},
				// clusters represent fuzzy sentences, so we can get fuzzy reuse
				clusters: [],
				clusterHash: {},
			}
			doc.sentences.push(sid)
			doc.sentenceHash[sid] = true
			doc.clusters.push(clusterId)
			doc.clusterHash[clusterId] = true
			documents[docid] = doc
		})

		xform.on('end', () => {
			resolve(count)
		})
		input.pipe(parser).pipe(xform)
	})
}

async function processFragmentSummaries(
	dataDir: string,
): Promise<Hash<Document>> {
	const files = await getFileList(dataDir, 'fragment_summaries_lsh', '.csv')
	console.log(`files: ${files[0]} + ${files.length - 1} more`)

	const documents = {}

	let count = 0
	for (const filename of files) {
		const fileRecords = await processFragmentFile(filename, documents)
		count += fileRecords
		console.log(
			`${count} rows read, ${Math.round(
				process.memoryUsage().heapUsed / 1000000,
			)}mb memory`,
		)
	}

	console.log('records', count)

	return documents
}

// runs through a list and adds up how many times the items occur in the hash
function intersectCount(list: number[], hash: Hash<boolean>) {
	return list.reduce((acc, cur) => {
		if (hash[cur]) {
			acc++
		}
		return acc
	}, 0)
}

// calculate the left/right intersection ratio
// note the 'fuzz' boolean - this indicates to use the cluster variant instead of sentence variant
function intersectRatio(
	left: Document,
	right: Document,
	fuzz: boolean,
): [number, number] {
	const leftSentences = fuzz ? left.clusters : left.sentences
	const leftHash = fuzz ? left.clusterHash : left.sentenceHash
	const rightSentences = fuzz ? right.clusters : right.sentences
	const rightHash = fuzz ? right.clusterHash : right.sentenceHash

	let isect = 0
	// shortcut: always start with shorter doc for intersection compute
	if (leftSentences <= rightSentences) {
		isect = intersectCount(leftSentences, rightHash)
	} else {
		isect = intersectCount(rightSentences, leftHash)
	}

	const leftPerc = isect / leftSentences.length
	const rightPerc = isect / rightSentences.length
	return [leftPerc, rightPerc]
}

function assignContainment(
	leftPerc: number,
	rightPerc: number,
	accumulator: any,
) {
	if (leftPerc >= 0.8) {
		if (rightPerc >= 0.8) {
			accumulator.mm++
		} else if (rightPerc >= 0.5) {
			accumulator.mc++
		} else if (rightPerc >= 0.1) {
			accumulator.mp++
		}
	} else if (leftPerc >= 0.5) {
		if (rightPerc >= 0.8) {
			accumulator.cm++
		} else if (rightPerc >= 0.5) {
			accumulator.cc++
		} else if (rightPerc >= 0.1) {
			accumulator.cp++
		}
	} else if (leftPerc >= 0.1) {
		if (rightPerc >= 0.8) {
			accumulator.pm++
		} else if (rightPerc >= 0.5) {
			accumulator.pc++
		} else if (rightPerc >= 0.1) {
			accumulator.pp++
		}
	}
}

function sampleDocuments(
	documents: Hash<Document>,
	proportion: number,
): Document[] {
	const ids = Object.keys(documents)
	const count = Math.round(ids.length * proportion)
	console.log(`extracting ${count} samples from ${ids.length} population`)
	const samples = []
	for (let i = 0; i < count; i++) {
		const next = Math.round(Math.random() * ids.length)
		const id = ids.splice(next, 1)[0]
		samples.push(documents[id])
	}
	return samples
}

/**
 * this computes the pairwise containment of document content within every other document
 * see categories in this paper:
 * http://maroo.cs.umass.edu/pub/web/getpdf.php?id=812
 */
function computeContainment(
	documents: Hash<Document>,
	sampleProportion: number,
) {
	const samples = sampleDocuments(documents, sampleProportion)

	let count = 0
	// this is the theoretical comparison total
	const total = (samples.length * samples.length - 1) / 2

	console.log(`computing containment with ~${total} comparisons`)

	const output = {
		documents: Object.keys(documents).length,
		samples: samples.length,
		comparisons: 0,
		total,
		exact: {
			mm: 0,
			mc: 0,
			mp: 0,
			cm: 0,
			cc: 0,
			cp: 0,
			pm: 0,
			pc: 0,
			pp: 0,
		},
		fuzzy: {
			mm: 0,
			mc: 0,
			mp: 0,
			cm: 0,
			cc: 0,
			cp: 0,
			pm: 0,
			pc: 0,
			pp: 0,
		},
	}

	for (let i = 0; i < samples.length; i++) {
		const leftDoc = samples[i]

		// shortcut: j starts at i, because we're doing pairwise both ways at once, so this iterates the top triangle
		for (let j = i + 1; j < samples.length; j++) {
			const rightDoc = samples[j]

			count++
			if (count % 1000000 === 0) {
				console.log(`${count} of ${total}`)
			}

			if (leftDoc.docid !== rightDoc.docid) {
				// run the exact match (this is what we did for CHI paper)
				const [leftPerc, rightPerc] = intersectRatio(leftDoc, rightDoc, false)
				assignContainment(leftPerc, rightPerc, output.exact)

				// now run it for fuzzy match
				const [leftPercFuzzy, rightPercFuzzy] = intersectRatio(
					leftDoc,
					rightDoc,
					true,
				)
				assignContainment(leftPercFuzzy, rightPercFuzzy, output.fuzzy)
			}
		}
	}

	output.comparisons = count
	return output
}

export async function reuse(
	dataset: string,
	dataRoot: string,
): Promise<number> {
	console.time('computing reuse stats')
	const dataDir = join(dataRoot, dataset)

	const documents = await processFragmentSummaries(dataDir)
	console.log(Object.keys(documents).length, 'documents')

	const containment = computeContainment(documents, 1.0)
	console.log(containment)

	await fsp.writeFile(
		join(dataDir, 'containment-sampled.json'),
		JSON.stringify(containment, null, 2),
	)
	console.timeEnd('computing reuse stats')
	return 0
}

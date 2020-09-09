/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as fs from 'fs'
import parse from 'csv-parse'
import { Collection, BulkWriteOpResultObject, MongoError } from 'mongodb'
import promiseRetry from 'promise-retry'
import transform from 'stream-transform'
import { RecordTransformer, RecordsBulkOperationTransformer } from '../types'
import { xform, chunk, DevNull, PUSH_CHUNK_SENTINEL } from './streams'

export function writeBatchWithRetry(
	collection: Collection,
	operations: any[],
	batchNumber: number,
	numRetries: number,
	batchSize: number,
): Promise<BulkWriteOpResultObject> {
	const isRetryable = (err: Error | MongoError) => {
		if (err instanceof MongoError) {
			console.log('mongo batch error; retryable?')
			console.warn(err)
			console.log(operations)
			return true
		}
		// script error, don't retry
		console.error(err)
		return false
	}

	if (operations.length === 0) {
		console.warn('empty batch')
		return Promise.resolve({})
	}
	return promiseRetry(
		(retry, number) => {
			if (number > 1) {
				console.log(`retry batch ${batchNumber}, #${number}`)
			}
			return collection.bulkWrite(operations).catch(err => {
				if (isRetryable(err)) {
					return retry(err)
				} else {
					throw err
				}
			})
		},
		{ retries: numRetries },
	)
}

/**
 * Streams a file row-by-row to a Mongo batch
 * @param {*} file
 * @param {*} database
 * @param {*} collectionName
 * @param {*} transformer
 * @param {*} indexes
 */
export async function streamFileBatches(
	collection: Collection,
	file: string,
	transformer: RecordTransformer,
	// transformer that accepts list of records and converts to mongo bulk operation
	toBulkOperation: RecordsBulkOperationTransformer,
	batchSize: number,
	batchParallelism: number,
	batchRetries: number,
): Promise<number> {
	return new Promise<number>((resolve, reject) => {
		const timer = `ingest ${file}`
		console.time(timer)

		let count = 0

		const preChunkStream = fs
			.createReadStream(file, { encoding: 'utf8' })
			.pipe(parse({ delimiter: ',', columns: true, escape: '\\' }))
			.pipe(xform(transformer))

		const chunker = chunk(batchSize)
		preChunkStream.on('end', () => {
			chunker.write(PUSH_CHUNK_SENTINEL)
		})

		preChunkStream
			.pipe(chunker)
			.pipe(xform(toBulkOperation))
			.pipe(
				transform({ parallel: batchParallelism }, (item: any, cb) => {
					count += item.operations.length
					process.stdout.write('.')
					writeBatchWithRetry(
						collection,
						item.operations,
						item.index,
						batchRetries,
						batchSize,
					)
						.then(() => cb())
						.catch(err => cb(err))
				}),
			)
			.pipe(new DevNull())
			.on('finish', () => {
				console.log('')
				console.timeEnd(timer)
				console.log(`file batches complete, ${count} documents`)
				resolve(count)
			})
			.on('error', err => reject(err))
	}).catch(err => {
		console.error('error importing file', err)
		throw err
	})
}

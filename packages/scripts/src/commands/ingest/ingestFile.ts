/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MongoClient, Collection, MongoError } from 'mongodb'
import {
	FieldIndexType,
	CollectionConfiguration,
	RecordTransformer,
} from '../../types'
import { getFileList } from '../../util/files'
import { createTransformer, createIndexConfigs } from '../../util/db'
import { streamFileBatches } from '../../util/batch'
import promiseRetry = require('promise-retry')

/**
 * Ingests a csv file using JSON config to create transformers and indexes.
 * @param {*} dataset
 * @param {*} name
 */
export async function ingestFile(
	client: MongoClient,
	dataDir: string,
	name: string,
	config: CollectionConfiguration,
	batchSize: number,
	batchParallelism: number,
	batchRetries: number,
) {
	console.log(
		`ingesting ${name} into collection '${name}' in batches of ${batchSize}`,
	)
	const conf = config || config[name]
	const transformer = createTransformer(conf)
	const indexes = createIndexConfigs(conf)

	const filenames = await getFileList(dataDir, name, '.csv')
	console.log(`files: ${filenames[0]} + ${filenames.length - 1} more`)

	return importFiles(
		client,
		filenames,
		name,
		transformer,
		indexes,
		batchSize,
		batchParallelism,
		batchRetries,
	)
}

async function importFiles(
	client: MongoClient,
	filenames: string[],
	collectionName: string,
	transformer: RecordTransformer,
	indexes: Record<string, FieldIndexType>[] = [],
	batchSize: number,
	batchParallelism: number,
	batchRetries: number,
) {
	const db = client.db()
	const collection = db.collection(collectionName)

	for (const filename of filenames) {
		await streamFileBatches(
			collection,
			filename,
			transformer,
			toBulkOperation,
			batchSize,
			batchParallelism,
			batchRetries,
		)
	}

	console.log('documents ingested, creating indexes')
	return createIndexes(collection, indexes, 1)
}

function toBulkOperation({
	items,
	index,
}: {
	items: any[]
	index: number
}): { operations: any[]; index: number } {
	return {
		operations: items.map(row => ({
			insertOne: { document: row },
		})),
		index,
	}
}

function createDocumentIndexWithRetry(
	collection: Collection,
	index: Record<string, FieldIndexType>,
	numRetries: number,
) {
	console.log('creating index', index)
	return promiseRetry(
		(retry, number) => {
			if (number > 1) {
				console.log(
					`retry index #${number} ${collection.collectionName}`,
					index,
				)
			}
			return collection
				.createIndex(index, {
					background: true,
				})
				.catch(err => {
					if (isRetryableError(err)) {
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
 * Creates indexes in an open collection.
 * @param {*} collection
 * @param {*} indexes
 */
async function createIndexes(
	collection: Collection,
	indexes: Record<string, FieldIndexType>[] = [],
	numRetries: number,
): Promise<any> {
	const indexCreationPromises: Promise<any>[] = indexes.map(index =>
		createDocumentIndexWithRetry(collection, index, numRetries),
	)
	return Promise.all(indexCreationPromises)
}

function isRetryableError(err: Error | MongoError): boolean {
	if (err instanceof MongoError) {
		if (err.code != null && NON_RETRYABLE_ERRORS.has(err.code)) {
			return false
		}
		console.log('mongo error; retryable?', err)
		return true
	}
	// script error, don't retry
	return false
}

const NON_RETRYABLE_ERRORS = new Set<number>([
	1, // resource not found (deleted in background?)
	67, // Unsupported index type
])

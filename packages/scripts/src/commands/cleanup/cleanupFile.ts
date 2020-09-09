/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join } from 'path'
import { MongoClient } from 'mongodb'
import {
	CollectionConfiguration,
	BulkOperation,
	RecordsBatch,
} from '../../types'
import { streamFileBatches } from '../../util/batch'
import { createTransformer } from '../../util/db'

/**
 * Ingests a csv file using JSON config to create transformers and indexes.
 * @param {*} dataset
 * @param {*} name
 */

export async function cleanupFile(
	client: MongoClient,
	dataDir: string,
	name: string,
	file: string,
	config: CollectionConfiguration,
	batchSize: number,
	batchParallelism: number,
	batchRetries: number,
) {
	console.log(
		`cleaning ${file} from collection '${name}' in batches of ${batchSize}`,
	)
	const conf = config || config[name]
	const transformer = createTransformer(conf)

	const db = client.db()
	const collection = db.collection(name)
	const filename = join(dataDir, file)

	return streamFileBatches(
		collection,
		filename,
		transformer,
		toBulkOperation,
		batchSize,
		batchParallelism,
		batchRetries,
	)
}

function toBulkOperation({ items, index }: RecordsBatch): BulkOperation {
	return {
		operations: items.map(row => ({
			deleteOne: { q: row },
		})),
		index,
	}
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join } from 'path'
import { MongoClient } from 'mongodb'
import { DatasetConfiguration } from '../../types'
import {
	DEFAULT_DB_URL,
	DEFAULT_DATA_ROOT,
	DEFAULT_CONFIG,
	DEFAULT_BATCH_SIZE,
	DEFAULT_BATCH_PARALLELISM,
	DEFAULT_NUM_RETRIES,
} from '../../util/defaults'
import { cleanupFile } from './cleanupFile'

export interface CleanupCommandOptions {
	verbose?: boolean
	collection: string
	file: string
	dbUrl?: string
	dataRoot?: string
	schema?: string
	batchSize?: number
	batchParallelism?: number
	batchRetries?: number
}

export async function execute(
	dataset: string,
	{
		verbose,
		collection,
		file,
		dbUrl = `${DEFAULT_DB_URL}/${dataset}`,
		dataRoot = DEFAULT_DATA_ROOT,
		schema,
		batchSize = DEFAULT_BATCH_SIZE,
		batchParallelism = DEFAULT_BATCH_PARALLELISM,
		batchRetries = DEFAULT_NUM_RETRIES,
	}: CleanupCommandOptions,
): Promise<number> {
	schema = schema != null ? join(process.cwd(), schema) : DEFAULT_CONFIG
	console.time('cleanup')
	/* eslint-disable-next-line @typescript-eslint/no-var-requires */
	const tableSchema: DatasetConfiguration = require(schema)
	console.log('cleaning up collection: ', collection)
	const client = await createClient(dbUrl)
	const dataDir = join(dataRoot, dataset)

	// TODO
	if (!collection || !file) {
		throw new Error('--collection and --file must be specified')
	}

	try {
		await cleanupFile(
			client,
			dataDir,
			collection,
			file,
			tableSchema[collection],
			batchSize,
			batchParallelism,
			batchRetries,
		)
	} finally {
		client.close()
	}

	console.timeEnd('cleanup')
	return 0
}

function createClient(dbUrl: string): Promise<MongoClient> {
	return MongoClient.connect(dbUrl, {
		appname: 'NewsThreads Scripts',
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
}

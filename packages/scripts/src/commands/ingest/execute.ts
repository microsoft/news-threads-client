/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join } from 'path'

import { MongoClient } from 'mongodb'

import { DatasetConfiguration } from '../../types'
import {
	DEFAULT_BATCH_PARALLELISM,
	DEFAULT_BATCH_SIZE,
	DEFAULT_CONFIG,
	DEFAULT_DATA_ROOT,
	DEFAULT_DB_URL,
	DEFAULT_NUM_RETRIES,
} from '../../util/defaults'
import { featureFlagMapping } from '../../util/featureFlagMapping'
import { insertDatasetDateRange } from '../../util/insertDatasetDateRange'
import { insertUpdateDataset } from '../../util/insertUpdateDataset'
import { ingestFile } from './ingestFile'

export interface IngestCommandOptions {
	verbose?: boolean
	collections?: string[]
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
		collections: rawCollections,
		dbUrl = `${DEFAULT_DB_URL}/${dataset}`,
		dataRoot = DEFAULT_DATA_ROOT,
		schema,
		batchSize = DEFAULT_BATCH_SIZE,
		batchParallelism = DEFAULT_BATCH_PARALLELISM,
		batchRetries = DEFAULT_NUM_RETRIES,
	}: IngestCommandOptions,
): Promise<number> {
	schema = schema != null ? join(process.cwd(), schema) : DEFAULT_CONFIG
	console.time('ingest')
	/* eslint-disable-next-line @typescript-eslint/no-var-requires */
	const tableSchema: DatasetConfiguration = require(schema)
	const defaultCollections = Object.keys(tableSchema)
	const collections: string[] = rawCollections
		? rawCollections
		: defaultCollections
	console.log('ingesting collections: ', collections)
	const client = await createClient(dbUrl)
	const dataDir = join(dataRoot, dataset)

	try {
		// Create dataset entry
		await insertUpdateDataset(client, { id: dataset, label: dataset })
		for (const name of collections) {
			await ingestFile(
				client,
				dataDir,
				name,
				tableSchema[name],
				batchSize,
				batchParallelism,
				batchRetries,
			)
			const flags = featureFlagMapping.get(name)
			if (flags) {
				// update dataset flags
				await insertUpdateDataset(client, {
					id: dataset,
					features: flags,
				})
			}
		}
		// Find and insert the start and end dates
		// for the dataset
		await insertDatasetDateRange(client, dataset)
	} finally {
		client.close()
	}

	console.timeEnd('ingest')
	return 0
}

function createClient(dbUrl: string): Promise<MongoClient> {
	return MongoClient.connect(dbUrl, {
		appname: 'NewsThreads Scripts',
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
}

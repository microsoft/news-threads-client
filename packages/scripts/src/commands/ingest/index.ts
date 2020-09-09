/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, IngestCommandOptions } from './execute'

export default function ingest(program: Command): void {
	program
		.command('ingest <dataset>')
		.description('ingests a dataset')
		.option('-v, --verbose', 'verbose output')
		.option(
			'--collections <collections>',
			'collection names to ingest, comma-separated',
		)
		.option(
			'--batchSize <batchSize>',
			'the number of rows to write per bulk operation',
		)
		.option(
			'--batchParallelism <batchParallelism>',
			'the number of bulk operations to write concurrently',
		)
		.option(
			'--batchRetries <batchRetries>',
			'the number of bulk operations to write concurrently',
		)
		.option(
			'--dataRoot <dataRoot>',
			'the root folder containing all datasets (default=~/news-data)',
		)
		.option(
			'--dbUrl <dbUrl>',
			'the MongoDB connection string to use (default=mongodb://localhost:27017/)',
		)
		.option(
			'--schema <schema>',
			'the collection schema file to use, default is to use news-prov tables',
		)
		.action(
			async (
				dataset: string,
				{
					verbose,
					collections,
					batchSize,
					batchParallelism,
					batchRetries,
					dataRoot,
					dbUrl,
					schema,
				}: IngestCommandOptions,
			) => {
				try {
					const code = await execute(dataset, {
						verbose,
						collections: collections
							? ((collections as any) as string).split(',').map(c => c.trim())
							: undefined,
						batchSize: batchSize ? +batchSize : undefined,
						batchRetries: batchRetries ? +batchRetries : undefined,
						batchParallelism: batchParallelism ? +batchParallelism : undefined,
						dataRoot,
						dbUrl,
						schema,
					})
					process.exit(code)
				} catch (err) {
					console.error('uncaught error', err)
					process.exit(1)
				}
			},
		)
}

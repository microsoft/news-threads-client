/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, CleanupCommandOptions } from './execute'

export default function cleanup(program: Command): void {
	program
		.command('cleanup <dataset>')
		.description("removes a specified file's records from the dataset")
		.option('-v, --verbose', 'verbose output')
		.option('--collection <collection>', 'collection name to cleanup')
		.option('--file <file>', 'file to remove from collection')
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
					collection,
					file,
					batchSize,
					batchParallelism,
					batchRetries,
					dataRoot,
					dbUrl,
					schema,
				}: CleanupCommandOptions,
			) => {
				try {
					const code = await execute(dataset, {
						verbose,
						collection,
						file,
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

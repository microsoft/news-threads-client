/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, BuildSearchIndexCommandOptions } from './execute'

export default function precompute(program: Command): void {
	program
		.command('buildSearchIndex <dataset>')
		.option(
			'--dbUrl <dbUrl>',
			'the MongoDB connection string to use (default=mongodb://localhost:27017/)',
		)
		.option('-v, --verbose', 'verbose output')
		.action(
			async (
				dataset: string,
				{ dbUrl, verbose }: BuildSearchIndexCommandOptions,
			) => {
				const code = await execute(dataset, { dbUrl, verbose })
				process.exit(code)
			},
		)
}

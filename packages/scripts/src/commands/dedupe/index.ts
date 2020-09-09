/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, DedupeCommandOptions } from './execute'

export default function dedupe(program: Command): void {
	program
		.command('dedupe <file>')
		.description('eliminate row duplication in a file')
		.usage('slurp dedupe ~/news-data/nbaChina/fragment_summaries.csv')
		.option('-v, --verbose', 'verbose output')
		.action(async (file: string, options: DedupeCommandOptions) => {
			try {
				const code = await execute(file, options)
				process.exit(code)
			} catch (err) {
				console.error('uncaught error', err)
				process.exit(1)
			}
		})
}

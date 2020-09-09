/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { DEFAULT_DATA_ROOT, DEFAULT_OUTPUT_ROOT } from '../../util/defaults'
import { execute, PrecomputeCommandOptions, defaultStats } from './execute'

export default function precompute(program: Command): void {
	program
		.command('precompute <dataset>')
		.option(
			'--dataRoot <dataRoot>',
			'the root folder containing all datasets (default=~/news-data)',
		)
		.option(
			'--outputRoot <outputRoot>',
			'the root folder to output computed dataset files (default=~/news-data)',
		)
		.option(
			'--stats <stats>',
			`which stats batches to compute: (options: ${defaultStats.join(',')})`,
		)
		.option('-v, --verbose', 'verbose output')
		.action(
			async (
				dataset: string,
				{ dataRoot, stats, verbose, outputRoot }: PrecomputeCommandOptions,
			) => {
				const code = await execute(dataset, {
					dataRoot: dataRoot || DEFAULT_DATA_ROOT,
					stats: stats
						? ((stats as any) as string).split(',').map(c => c.trim())
						: undefined,
					verbose,
					outputRoot: outputRoot || DEFAULT_OUTPUT_ROOT,
				})
				process.exit(code)
			},
		)
}

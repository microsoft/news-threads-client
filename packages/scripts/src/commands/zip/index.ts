/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Command } from 'commander'
import { execute, ZipCommandOptions } from './execute'

export default function zip(program: Command): void {
	program
		.command('zip <destination> <sources...>')
		.option(
			'--cwd <cwd>',
			'Specify working directory (default=.)',
			process.cwd(),
		)
		.action(
			async (
				destination: string,
				sources: string[],
				{ cwd }: ZipCommandOptions,
			) => {
				const code = await execute(destination, sources, { cwd })
				process.exit(code)
			},
		)
}

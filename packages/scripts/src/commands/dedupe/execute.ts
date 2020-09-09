/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { promises as fs } from 'fs'
import { readAndKeep } from '../../util/readAndKeep'

export interface DedupeCommandOptions {
	verbose?: boolean
}

export async function execute(
	filename: string,
	options: DedupeCommandOptions,
): Promise<number> {
	console.time('dedupe')
	await dedupFile(filename)
	console.timeEnd('dedupe')
	return 0
}

/**
 * TODO: copy header
 * some of the pipeline files have a lot of duplicate rows, need to clean these out before we do anything
 */
async function dedupFile(filename: string): Promise<void> {
	// first copy the original to a backup file, then replace the csv with deduped copy
	await fs.copyFile(filename, `${filename}.bak`)
	const dedup: Record<string, boolean> = {}
	const lines = await readAndKeep(
		filename,
		null,
		line => {
			if (dedup[line]) {
				return false
			}
			dedup[line] = true
			return true
		},
		true,
	)
	console.log(lines.slice(0, 10))
	await fs.writeFile(filename, lines.join('\n'))
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// this script initiates some pre-computed stats/collections in the database.
// it should be the ONLY launching point for this, as the rest of the collections are entirely
// ingested as though using an import tool
// unfortunately, some data must be pre-computed due to the volume,
// so this script should serve as a guide to outputs that could eventually be baked into the python/spark pipeline
import { docstats } from './docstats'
import { domains } from './domains'
import { queries } from './queries'
import { queriesOss } from './queriesOss'
import { reuse } from './reuse'
import { sentences } from './sentences'
import { terms } from './terms'
import { termsNewsGuard } from './termsNewsGuard'

export interface PrecomputeCommandOptions {
	dataRoot?: string
	outputRoot?: string
	verbose?: boolean
	stats?: string[]
}

const cmds = {
	sentences,
	terms,
	termsNewsGuard,
	queries,
	reuse,
	queriesOss,
	docstats,
	domains,
} as any

export const defaultStats = Object.keys(cmds)

export async function execute(
	dataset: string,
	{ dataRoot, stats, verbose, outputRoot }: PrecomputeCommandOptions,
): Promise<number> {
	console.time('precompute')

	if (!stats) {
		throw new Error('--stats required, some in full list are deprecating')
	}
	for (const stat of stats) {
		console.log('processing', stat)
		await cmds[stat](dataset, dataRoot, outputRoot)
	}

	console.timeEnd('precompute')
	return 0
}

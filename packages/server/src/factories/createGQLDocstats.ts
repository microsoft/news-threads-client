/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DocumentStats } from '@newsthreads/schema/lib/provider-types'
import { DbDocumentStats } from '../data'
import { packId } from '../util'

export function createGQLDocstats(
	stats: DbDocumentStats,
	dataset: string,
): DocumentStats {
	return {
		...stats,
		__typename: 'DocumentStats',
		id: packId(stats.docid!, dataset),
	} as DocumentStats
}

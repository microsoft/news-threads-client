/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import {
	SearchDomainStatsContext,
	searchDomainStats,
} from '../db_collections/domain_summaries'
import { DatasetId, DbDomainStats } from '../types'

export interface QueryDomainsStatsContext extends SearchDomainStatsContext {
	dataset: DatasetId
}
export async function queryDomainsStats(
	context: QueryDomainsStatsContext,
): Promise<[DbDomainStats[], number]> {
	const client = await getClient(context.dataset)
	const db = client.db()
	return searchDomainStats(db, context)
}

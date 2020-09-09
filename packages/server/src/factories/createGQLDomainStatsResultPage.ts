/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DomainStats,
	DomainStatsResultPage,
} from '@newsthreads/schema/lib/provider-types'
import { DbDomainStats } from '../data'
import { createGQLDomainStats } from './createGQLDomainStats'

export function createGQLDomainStatsResultPage(
	domains: DbDomainStats[],
	dataset: string,
	offset: number | null | undefined,
	totalCount: number,
): DomainStatsResultPage {
	if (offset == null) {
		offset = 0
	}
	return {
		// XXX: are there often null results?
		data: domains
			.filter(d => !!d)
			.map(domain => createGQLDomainStats(domain, dataset)) as DomainStats[],
		totalCount,
		offset,
		hasNextPage: offset + domains.length < totalCount,
		__typename: 'DomainStatsResultPage',
	}
}

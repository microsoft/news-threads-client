/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DomainStats } from '@newsthreads/schema/lib/provider-types'
import { DbDomainStats } from '../data'
import { packId } from '../util'
import { trimDomain } from './util'
import { createGQLDomainRating } from '.'

export function createGQLDomainStats(
	domain: DbDomainStats,
	dataset: string,
): DomainStats {
	return {
		...domain,
		id: packId(domain.domain, dataset),
		// this is a sanity check, it should be done on ingest
		domain: trimDomain(domain.domain),
		rating: createGQLDomainRating(domain.rating),
		__typename: 'DomainStats',
	} as DomainStats
}

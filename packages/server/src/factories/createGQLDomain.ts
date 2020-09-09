/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Domain } from '@newsthreads/schema/lib/provider-types'
import { DbDomain } from '../data'
import { trimDomain } from './util'
import { createGQLDomainRating } from '.'

export function createGQLDomain(info: DbDomain): Domain {
	return {
		...info,
		id: info.domain,
		domain: trimDomain(info.domain),
		parentDomain: trimDomain(info.parentDomain),
		lastUpdated: info.lastUpdated.toISOString(),
		rating: createGQLDomainRating(info.rating),
		__typename: 'Domain',
	} as Domain
}

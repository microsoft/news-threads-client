/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DomainRating } from '@newsthreads/schema/lib/provider-types'
import { DbDomainRating } from '../data'

export function createGQLDomainRating(
	rating: DbDomainRating | null,
): DomainRating {
	if (rating === DbDomainRating.Trustworthy) {
		return 'Trustworthy'
	} else if (rating === DbDomainRating.NotTrustworthy) {
		return 'NotTrustworthy'
	} else if (rating === DbDomainRating.Parody) {
		return 'Parody'
	} else {
		return 'Unknown'
	}
}

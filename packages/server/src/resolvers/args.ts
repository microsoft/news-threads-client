/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DocumentSortBy,
	DomainRating,
	SortDirection,
	SentenceClusterSortBy,
	DomainStatsSortBy,
} from '@newsthreads/schema/lib/provider-types'
import Maybe from 'graphql/tsutils/Maybe'
import { DbDomainRating, DbSortDirection } from '../data'

export function unpackDomainRating(
	domainRating: Maybe<DomainRating>,
): DbDomainRating | null {
	if (domainRating === 'Trustworthy') {
		return DbDomainRating.Trustworthy
	} else if (domainRating === 'NotTrustworthy') {
		return DbDomainRating.NotTrustworthy
	} else if (domainRating === 'Parody') {
		return DbDomainRating.Parody
	} else {
		return null
	}
}

export function unpackDocumentSortBy(
	sortBy: Maybe<DocumentSortBy>,
): string | undefined {
	if (sortBy == null) {
		return undefined
	}
	if (sortBy === 'DomainScore') {
		return 'domainScore'
	} else if (sortBy === 'Score') {
		return 'score'
	} else if (sortBy === 'Date') {
		return 'date'
	} else if (sortBy === 'Variation') {
		return 'instanceVariantRatio'
	} else if (sortBy === 'Duplication') {
		return 'instanceDuplicateRatio'
	} else {
		throw new Error(`unhandled SortBy value: ${sortBy}`)
	}
}

export function unpackSentenceClusterSortBy(
	sortBy: Maybe<SentenceClusterSortBy>,
): string | undefined {
	if (sortBy == null) {
		return undefined
	}
	if (sortBy === 'Instances') {
		return 'instanceCount'
	} else if (sortBy === 'Variants') {
		return 'variantCount'
	} else if (sortBy === 'Duplicates') {
		return 'duplicateCount'
	} else if (sortBy === 'InstanceVariantRatio') {
		return 'instanceVariantRatio'
	} else if (sortBy === 'InstanceDuplicateRatio') {
		return 'instanceDuplicateRatio'
	} else {
		throw new Error(`unhandled clustersortby: ${sortBy}`)
	}
}

export function unpackDomainStatsSortBy(
	sortBy: Maybe<DomainStatsSortBy>,
): string | undefined {
	if (sortBy == null) {
		return undefined
	}
	if (sortBy === 'Domain') {
		return 'domain'
	} else if (sortBy === 'Score') {
		return 'score'
	} else if (sortBy === 'Rating') {
		return 'rating'
	} else if (sortBy === 'Documents') {
		return 'documents'
	} else if (sortBy === 'Instances') {
		return 'instanceCount'
	} else if (sortBy === 'Variants') {
		return 'variantCount'
	} else if (sortBy === 'Duplicates') {
		return 'duplicateCount'
	} else if (sortBy === 'InstanceVariantRatio') {
		return 'instanceVariantRatio'
	} else if (sortBy === 'InstanceDuplicateRatio') {
		return 'instanceDuplicateRatio'
	} else {
		throw new Error(`unhandled domainsortby: ${sortBy}`)
	}
}

export function unpackSortDirection(
	dir: Maybe<SortDirection>,
): DbSortDirection | undefined {
	if (dir == null) {
		return undefined
	}
	return dir === 'Ascending'
		? DbSortDirection.Ascending
		: DbSortDirection.Descending
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FilterQuery } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import {
	DbDomainStats,
	PaginationContext,
	DbDomainRating,
	DbSortDirection,
} from '../types'
import { applyMinMax } from './criteria'

// TODO: these are repeated, but may be sensible as common values
const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 25

export interface SearchDomainStatsContext extends PaginationContext {
	domain?: string | null
	domainRating?: DbDomainRating | null
	minDomainScore?: number | null
	maxDomainScore?: number | null
}

export async function searchDomainStats(
	db,
	{
		domain,
		domainRating,
		minDomainScore,
		maxDomainScore,
		limit,
		offset,
		sort,
		dir,
	}: SearchDomainStatsContext,
): Promise<[DbDomainStats[], number]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.domainSummaries
	if (offset == null) {
		offset = DEFAULT_OFFSET
	}
	if (limit == null) {
		limit = DEFAULT_LIMIT
	}

	const domainSearch = domain?.replace(/www\./i, '')
	const order = dir === DbSortDirection.Ascending ? 1 : -1
	// default to sorting by date if a text query was not provided.
	const sortByField = sort || 'domain'
	const sortBy = { sort: { [sortByField]: order } }

	const filter: FilterQuery<DbDomainStats> = {}

	if (domainSearch) {
		filter.domain = { $regex: new RegExp(domainSearch, 'i') }
	}
	if (domainRating) {
		filter.domainRating = domainRating
	}
	applyMinMax(filter, 'score', minDomainScore, maxDomainScore)

	const result = db
		.collection(COLLECTION_NAME)
		.find(filter, {
			projection: {
				_id: 0,
			},
			...sortBy,
		})
		.skip(offset)
		.limit(limit)

	const items = await result.toArray()
	const count = await result.count()
	return [items, count]
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db, FilterQuery } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import {
	Scored,
	PaginationContext,
	DbSearchDocument,
	DbDomainRating,
	DbSortDirection,
} from '../types'
import { applyMinMax } from './criteria'

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 25

export interface SearchDocumentsContext extends PaginationContext {
	query?: string | null
	domain?: string | null
	domainRating?: DbDomainRating | null
	minDate?: string | null
	maxDate?: string | null
	minDomainScore?: number | null
	maxDomainScore?: number | null
	minInstanceVariantRatio?: number | null
	maxInstanceVariantRatio?: number | null
	minInstanceDuplicateRatio?: number | null
	maxInstanceDuplicateRatio?: number | null
}

/**
 * Search for documents with the given query term
 *
 * @param db The mongo db
 * @param query The query text
 * @param limit The document count limit
 */
export async function searchDocuments(
	db: Db,
	{
		query,
		domain,
		domainRating,
		minDomainScore,
		maxDomainScore,
		minDate,
		maxDate,
		limit,
		offset,
		sort,
		dir,
		minInstanceVariantRatio,
		maxInstanceVariantRatio,
		minInstanceDuplicateRatio,
		maxInstanceDuplicateRatio,
	}: SearchDocumentsContext,
): Promise<[Scored<DbSearchDocument>[], number]> {
	if (offset == null) {
		offset = DEFAULT_OFFSET
	}
	if (limit == null) {
		limit = DEFAULT_LIMIT
	}

	const COLLECTION_NAME = (await getCollectionNames(db.databaseName)).docsearch

	const text = query?.startsWith('http') ? null : query
	const url = query?.startsWith('http') ? query : null

	const domainSearch = domain?.replace(/www\./i, '')
	const order = dir === DbSortDirection.Ascending ? 1 : -1
	// Sort by date if sort option was not provided
	let sortByField = sort || 'date'
	// Or sort by date if sort option == score and query text was not provided
	if (sortByField === 'score' && !text) {
		sortByField = 'date'
	}
	const sortByScore = { sort: { score: { $meta: 'textScore' } } }
	const sortBy =
		sortByField === 'score' ? sortByScore : { sort: { [sortByField]: order } }

	const filter: FilterQuery<DbSearchDocument> = {}
	if (text) {
		filter.$text = { $search: text }
	}
	if (url) {
		filter.url = url
	}
	if (domainSearch) {
		filter.domain = { $regex: new RegExp(domainSearch, 'i') }
	}
	if (domainRating) {
		filter.domainRating = domainRating
	}
	applyMinMax(filter, 'domainScore', minDomainScore, maxDomainScore)
	applyMinMax(
		filter,
		'date',
		minDate ? new Date(minDate) : null,
		maxDate ? new Date(maxDate) : null,
	)
	applyMinMax(
		filter,
		'instanceVariantRatio',
		minInstanceVariantRatio,
		maxInstanceVariantRatio,
	)
	applyMinMax(
		filter,
		'instanceDuplicateRatio',
		minInstanceDuplicateRatio,
		maxInstanceDuplicateRatio,
	)

	const result = db
		.collection(COLLECTION_NAME)
		.find(filter, {
			projection: {
				_id: 0,
				...(text && { score: { $meta: 'textScore' } }),
			},
			...sortBy,
		} as any)
		.skip(offset)
		.limit(limit)

	const items = await result.toArray()
	const count = await result.count()
	return [items as any[], count]
}

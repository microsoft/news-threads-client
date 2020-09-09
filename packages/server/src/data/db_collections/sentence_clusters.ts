/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db, FilterQuery } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import { DbSentenceCluster } from '../types'

export async function fetchSentenceClusterSummaries(
	db: Db,
	sort = 'instanceCount',
	direction = 'desc',
	limit = 100,
	query?: string,
	ids?: number[],
): Promise<DbSentenceCluster[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.sentenceClusterSummaries
	const collection = db.collection(COLLECTION_NAME)
	const dir = direction === 'desc' ? -1 : 1
	const filter: FilterQuery<DbSentenceCluster> = {}

	if (query) {
		filter.$text = { $search: query }
	}
	if (ids) {
		filter.sourceId = { $in: ids }
	}
	return (await collection
		.find(filter, {
			projection: { _id: 0 },
		})
		.sort({ [`${sort}`]: dir })
		.limit(limit)
		.toArray()) as any[]
}

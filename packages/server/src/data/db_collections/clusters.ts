/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db, FilterQuery } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import { DbCluster, ClusterId, DocumentId } from '../types'

/**
 * Get the documents in the cluster
 *
 * @param db The mongo db
 * @param clusterId The cluster id
 * @param epsilon The episolon level
 */
export async function fetchDocumentIdsInCluster(
	db: Db,
	clusterId: ClusterId,
	epsilon: number,
): Promise<DbCluster[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.joinedClusterLabels
	const result = await db
		.collection(COLLECTION_NAME)
		.find(
			{
				epsilon,
				clusterId,
			},
			{
				projection: { _id: 0, epsilon: 0, clusterId: 0 },
			},
		)
		.toArray()
	return result as any[]
}

/**
 * Get rows that match the given document id
 *
 * @param db The mongo connectino
 * @param docid Thedocument id
 */
export async function fetchClustersWithDocumentId(
	db: Db,
	docid: DocumentId,
	epsilon?: number | null | undefined,
): Promise<DbCluster[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.joinedClusterLabels
	const filter: FilterQuery<DbCluster> = { docid }
	if (epsilon != null) {
		filter.epsilon = epsilon
	}

	const result = (await db
		.collection(COLLECTION_NAME)
		.find(filter, {
			projection: { _id: 0, docid: 0 },
			sort: { epsilon: 1 },
		})
		.toArray()) as any[]

	const itemHash = new Set()
	const unique: DbCluster[] = []
	result.forEach(r => {
		const uniqueId = `${r.clusterId}|${r.epsilon}`
		if (!itemHash.has(uniqueId)) {
			itemHash.add(uniqueId)
			unique.push(r)
		}
	})
	return unique
}

/**
 * Count the number of cluster rows that match thesearch criteria
 *
 * @param db The mongodb connectino
 * @param criteria The search criteria
 */
export async function fetchClusterRowCount(
	db: Db,
	criteria: Partial<DbCluster>,
): Promise<number> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.joinedClusterLabels
	return db.collection(COLLECTION_NAME).count(criteria)
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import {
	fetchClustersWithDocumentId,
	fetchClusterRowCount,
} from '../db_collections'
import { DatasetId, DocumentId, DbCluster } from '../types'

export async function queryDocumentClusters(
	dataset: DatasetId,
	docid: DocumentId,
	epsilon?: number | null | undefined,
	documentCount?: boolean,
): Promise<DbCluster[]> {
	const client = await getClient(dataset)
	const db = client.db()
	const results = await fetchClustersWithDocumentId(db, docid, epsilon)
	if (documentCount) {
		const counts = await Promise.all(
			results.map(cluster => fetchClusterRowCount(db, cluster)),
		)
		return results.map((r, index) => ({
			...r,
			documentCount: counts[index],
		}))
	}
	return results
}

export async function queryClusterDocumentCount(
	dataset: string,
	criteria: Partial<DbCluster>,
) {
	const client = await getClient(dataset)
	const db = client.db()
	return fetchClusterRowCount(db, criteria)
}

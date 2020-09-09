/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import {
	fetchDocumentsByIds,
	fetchDocumentIdsInCluster,
} from '../db_collections'
import { DatasetId, DbDocument, ClusterId } from '../types'

export async function queryClusterDocuments(
	dataset: DatasetId,
	epsilon: number,
	clusterId: ClusterId,
): Promise<DbDocument[]> {
	const client = await getClient(dataset)
	const db = client.db()
	const docs = await fetchDocumentIdsInCluster(db, clusterId, epsilon)
	const docids = docs.map(d => d.docid)
	const result = await fetchDocumentsByIds(db, docids)
	return result.filter(r => !!r) as DbDocument[]
}

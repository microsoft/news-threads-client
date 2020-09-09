/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import { fetchDocumentStatsByIds } from '../db_collections'
import { DatasetId, DocumentId, DbDocumentStats } from '../types'

/**
 * Get document stats for given id
 * @param dataset The dataset id
 * @param docid The document id
 */
export async function queryDocumentStatsByIds(
	dataset: DatasetId,
	docids: DocumentId[],
): Promise<Array<DbDocumentStats | null>> {
	const client = await getClient(dataset)
	const db = client.db()
	return fetchDocumentStatsByIds(db, docids)
}

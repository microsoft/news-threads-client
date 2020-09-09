/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import { fetchDocumentById } from '../db_collections'
import { DatasetId, DocumentId, DbDocument } from '../types'

/**
 * Get the document info with a given id
 * @param dataset The dataset id
 * @param docid The document id
 */
export async function queryDocument(
	dataset: DatasetId,
	docid: DocumentId,
): Promise<DbDocument | null> {
	const client = await getClient(dataset)
	const db = client.db()
	return fetchDocumentById(db, docid)
}

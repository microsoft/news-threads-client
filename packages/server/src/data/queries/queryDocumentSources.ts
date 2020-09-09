/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import {
	fetchSentencesInDocument,
	fetchDocumentsByIds,
} from '../db_collections'
import { DatasetId, DocumentId, DbDocument } from '../types'
import { querySentenceInstance } from './internal/querySentenceInstance'

/**
 * get all the source documents for a doc, based on first found sentences
 *
 * @param dataset The dataset id
 * @param docid The documentId
 */
export async function queryDocumentSources(
	dataset: DatasetId,
	docid: DocumentId,
): Promise<DbDocument[]> {
	const client = await getClient(dataset)
	const db = client.db()
	const sentences = await fetchSentencesInDocument(db, docid)
	const instances = await Promise.all(
		sentences.map(s => querySentenceInstance(db, s.sid)),
	)
	const firsts = instances.map((i: any) => i[0].docid)
	const documents = (await fetchDocumentsByIds(db, firsts)).filter(
		t => !!t,
	) as DbDocument[]
	return documents.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
}

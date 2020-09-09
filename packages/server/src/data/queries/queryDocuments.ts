/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import {
	SearchDocumentsContext,
	searchDocuments,
	fetchDocumentsByIds,
} from '../db_collections'
import { DatasetId, DbDocument, Scored } from '../types'

export interface QueryDocumentsContext extends SearchDocumentsContext {
	dataset: DatasetId
}

export async function queryDocuments(
	context: QueryDocumentsContext,
): Promise<[Scored<DbDocument>[], number]> {
	const client = await getClient(context.dataset)
	const db = client.db()
	const [results, totalCount] = await searchDocuments(db, context)
	const docids = results.map(r => r.docid)
	const docs: Scored<DbDocument>[] = (await fetchDocumentsByIds(
		db,
		docids,
	)) as Scored<DbDocument>[]

	// transfer text-match scores over
	docs.forEach((d, index) => {
		if (d) {
			d.score = results[index].score
		}
	})

	return [docs, totalCount]
}

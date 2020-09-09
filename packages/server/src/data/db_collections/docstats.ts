/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import { DocumentId, DbDocumentStats } from '../types'

/**
 * Gets document stats by ID
 * @param db The db instance
 * @param docid The document id
 */
export async function fetchDocumentStatsById(
	db: Db,
	docid: DocumentId,
): Promise<DbDocumentStats | null> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName)).docstats
	return (await db.collection(COLLECTION_NAME).findOne(
		{
			docid,
		},
		{
			projection: { _id: 0 },
		},
	)) as any
}

/**
 * Gets document stats by ID
 * @param db The db instance
 * @param docid The document id
 */
export async function fetchDocumentStatsByIds(
	db: Db,
	docids: DocumentId[],
): Promise<Array<DbDocumentStats | null>> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName)).docstats
	const docs = (await db
		.collection(COLLECTION_NAME)
		.find(
			{
				docid: { $in: docids },
			},
			{
				projection: { _id: 0 },
			},
		)
		.toArray()) as any[]
	const hash: Record<string, DbDocumentStats> = {}
	docs.forEach(doc => (hash[doc.docid] = doc))
	return docids.map(docid => hash[docid] || null)
}

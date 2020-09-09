/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import { DocumentId, DbDocument } from '../types'

/**
 * Gets a document by id
 * @param db The db instance
 * @param docid The document id
 */
export async function fetchDocumentById(
	db: Db,
	docid: DocumentId,
): Promise<DbDocument | null> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName)).documents
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
 * Get the metadata of a set of documents minus full text
 *
 * @param db The mongo db
 * @param docids The document ids
 */
export async function fetchDocumentsByIds(
	db: Db,
	docids: DocumentId[],
): Promise<Array<DbDocument | null>> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName)).documents
	const docs = ((await db
		.collection(COLLECTION_NAME)
		.find(
			{
				docid: { $in: docids },
			},
			{
				projection: { _id: 0 },
			},
		)
		.toArray()) as any[]) as DbDocument[]

	const hash: Record<string, DbDocument> = {}
	docs.forEach(doc => (hash[doc.docid] = doc))

	return docids.map(docid => hash[docid] || null)
}

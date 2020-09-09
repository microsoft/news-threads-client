/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import { ClusterId, DbSentence, DocumentId, SentenceId } from '../types'

/**
 * Get the sentence with a given id
 * @param db The MongoDB
 * @param sid The sentence id
 */
export async function fetchSentenceWithId(
	db: Db,
	sid: SentenceId,
): Promise<DbSentence | null> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.fragmentSummaries
	return (await db.collection(COLLECTION_NAME).findOne(
		{
			sid,
		},
		{
			projection: { _id: 0 },
		},
	)) as any
}

/**
 * Gets sentence info from a set of IDs
 * @param db The mongo db
 * @param sids The sentence ids
 */
export async function fetchSentencesWithIds(
	db: Db,
	sids: SentenceId[],
): Promise<DbSentence[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.fragmentSummaries
	return (await db
		.collection(COLLECTION_NAME)
		.find(
			{
				sid: { $in: sids },
			},
			{
				projection: { _id: 0 },
			},
		)
		.toArray()) as any[]
}

/**
 * Get a list of DbSentence objects pertaining to the given document
 * @param db The mongo database
 * @param docid The document id
 */
export async function fetchSentencesInDocument(
	db: Db,
	docid: DocumentId,
): Promise<DbSentence[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.fragmentSummaries
	return (await db
		.collection(COLLECTION_NAME)
		.find(
			{
				docid,
			},
			{
				sort: { sindex: 1 },
				projection: { _id: 0 },
			},
		)
		.toArray()) as any[]
}

/**
 * Get sentences in the given clusters
 * @param db The mongo db
 * @param cids The cluster ids
 */
export async function getSentencesInClusters(
	db: Db,
	cids: ClusterId[],
): Promise<DbSentence[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.fragmentSummaries
	return (await db
		.collection(COLLECTION_NAME)
		.find(
			{
				clusterId: { $in: cids },
			},
			{
				projection: { _id: 0 },
			},
		)
		.toArray()) as any[]
}

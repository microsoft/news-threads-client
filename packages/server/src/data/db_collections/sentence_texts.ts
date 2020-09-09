/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db, FilterQuery } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import { SentenceId, DbSentenceText } from '../types'

/**
 * Gets the text of given sentence ids
 *
 * @param db The mongo db
 * @param ids The sentence ids
 */
export async function fetchSentenceText(
	db: Db,
	ids: SentenceId,
): Promise<DbSentenceText | null> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.sentenceIdLookup
	return (await db.collection(COLLECTION_NAME).findOne(
		{
			sid: { $in: ids },
		},
		{
			projection: { _id: 0 },
		},
	)) as any
}

/**
 * Gets the text of given sentence ids
 *
 * @param db The mongo db
 * @param ids The sentence ids
 */
export async function fetchSentenceTexts(
	db: Db,
	ids: SentenceId[],
): Promise<DbSentenceText[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.sentenceIdLookup
	return (await db
		.collection(COLLECTION_NAME)
		.find(
			{
				sid: { $in: ids },
			},
			{
				projection: { _id: 0 },
			},
		)
		.toArray()) as any[]
}

export async function querySentences(
	db: Db,
	query: string,
	limit = 100,
	excludeText = false,
): Promise<DbSentenceText[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.sentenceIdLookup
	const filter: FilterQuery<DbSentenceText> = {
		$text: { $search: query },
	}
	const projection: any = {
		_id: 0,
	}
	if (excludeText) {
		projection.text = 0
	}
	return db
		.collection(COLLECTION_NAME)
		.find(filter, {
			projection,
		})
		.limit(limit)
		.toArray()
}

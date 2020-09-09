/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'
import { getClient } from '../client'
import {
	fetchSentenceTexts,
	fetchSentenceClusterSummaries,
	querySentences,
} from '../db_collections'
import { DatasetId, DbSentenceCluster } from '../types'

export async function findOrderedSentenceClusters(
	dataset: DatasetId,
	sort: string | undefined,
	dir: string | undefined,
	limit: number | undefined,
	query: string | undefined,
): Promise<DbSentenceCluster[]> {
	const client = await getClient(dataset)
	const db = client.db()

	// find one to test for presence of new denormalized field
	const first = (await fetchSentenceClusterSummaries(db, sort, dir, 1))[0]

	if (first.sourceSentenceText) {
		return fetchSentenceClusterSummaries(db, sort, dir, limit, query)
	} else {
		return fetchAndJoinText(db, sort, dir, limit, query)
	}
}

// performs manual join against sentence_id_lookup table
// this is for older datasets (pre June 2020) that do not
// have the denormalized text in the sentence cluster table
async function fetchAndJoinText(
	db: Db,
	sort: string | undefined,
	dir: string | undefined,
	limit: number | undefined,
	query: string | undefined,
): Promise<DbSentenceCluster[]> {
	let ids: number[] | undefined
	if (query) {
		console.time('query')
		// HACK: this is a temporary workaround to find a bunch of top matches in older, normalized datasets
		// it is necessarily flawed because any hard-coded limit could miss the top clusters
		// using 100k limit here has collected all instances of test searches of interest for now
		const matches = await querySentences(db, query, 100000, true)

		console.log(`full text matches: ${matches.length}`)
		ids = matches.map(s => s.sid)
		console.timeEnd('query')
	}
	const summaries = await fetchSentenceClusterSummaries(
		db,
		sort,
		dir,
		limit,
		undefined,
		ids,
	)
	const texts = await fetchSentenceTexts(
		db,
		summaries.map(s => s.sourceId),
	)
	const textHash = texts.reduce((acc, cur) => {
		acc[cur.sid] = cur.text
		return acc
	}, {})
	return summaries.map(summary => ({
		...summary,
		sourceSentenceText: textHash[summary.sourceId],
	}))
}

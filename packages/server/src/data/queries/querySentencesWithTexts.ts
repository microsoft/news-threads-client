/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import {
	fetchSentencesInDocument,
	fetchSentenceTexts,
	getSentencesInClusters,
	fetchSentencesWithIds,
} from '../db_collections'
import {
	getAllSentenceIds,
	getClusterIdsFromSentences,
	getClusterIdToSentenceMap,
	countInstancesOfSentence,
	countUniqueSentences,
	getSentenceToTextMap,
	deduplicateSentences,
} from '../munging'
import {
	DatasetId,
	DocumentId,
	DbSentence,
	SentenceId,
	DbSentenceWithStats,
} from '../types'

/**
 * Get sentence stats info for the given document
 * @param dataset The dataset id
 * @param docid The document id
 */
export async function querySentencesWithTexts(
	dataset: DatasetId,
	docid: DocumentId,
): Promise<DbSentenceWithStats[]> {
	const client = await getClient(dataset)
	const db = client.db()
	const rawSentences = await fetchSentencesInDocument(db, docid)
	const sentences = deduplicateSentences(rawSentences)

	// flatten so we have both main id and source id
	const ids: SentenceId[] = getAllSentenceIds(sentences)
	const documentSentences = await fetchSentencesWithIds(db, ids)

	// Get clusters and cluster-sentences
	const cids = getClusterIdsFromSentences(documentSentences)
	const clusterSentences = await getSentencesInClusters(db, cids)
	const clusterIdToSentences = getClusterIdToSentenceMap(clusterSentences)

	// bin the full sentence list based in each one's matching cluster
	const clustered = sentences.map(s => {
		const sentencesInCluster = clusterIdToSentences[s.clusterId]
		const entries: DbSentence[] = deduplicateSentences(
			sentencesInCluster,
			cur => `${cur.docid}-${cur.sid}-${cur.sindex}`,
		)
		const sourceId = entries[0].sourceId
		const duplicates = countInstancesOfSentence(sourceId, entries) - 1
		const variants = countUniqueSentences(sentencesInCluster)
		return {
			variants,
			entries,
			duplicates,
		}
	}, [])

	const texts = await fetchSentenceTexts(db, ids)
	const textHash = getSentenceToTextMap(texts)

	// merge into a total results
	return sentences.map(
		(s, i) =>
			({
				...s,
				text: textHash[s.sid],
				sourceText: textHash[s.sourceId],
				instanceCount: clustered[i].entries.length,
				variantCount: clustered[i].variants,
				duplicateCount: clustered[i].duplicates,
			} as DbSentenceWithStats),
	)
}

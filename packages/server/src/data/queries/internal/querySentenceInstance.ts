/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'
import {
	fetchDocumentsByIds,
	getSentencesInClusters,
	fetchSentenceWithId,
	fetchSentenceTexts,
} from '../../db_collections'
import {
	deduplicateSentences,
	getSentenceToTextMap,
	dedupNumbers,
	filterSentenceClustersToVariants,
} from '../../munging'
import { DocumentId, DbSentence, SentenceId, DbDocument } from '../../types'

/**
 * @internal
 */
export async function querySentenceInstance(
	db: Db,
	sid: SentenceId,
	variantsOnly = false,
): Promise<DbSentence[]> {
	const sentence = await fetchSentenceWithId(db, sid)
	if (!sentence) {
		return []
	}
	// Get sentences in the cluster
	const clusterSentencesRaw = await getSentencesInClusters(db, [
		sentence.clusterId,
	])
	const clusterSentences: DbSentence[] = deduplicateSentences(
		clusterSentencesRaw,
		cur => `${cur.docid}-${cur.sid}-${cur.sindex}`,
	)

	// Get sentence texts
	const ids = dedupNumbers(clusterSentences.map(s => s.sid))
	const texts = await fetchSentenceTexts(db, ids)
	const textHash = getSentenceToTextMap(texts)

	// Get documents for sentences
	const sentences = filterSentenceClustersToVariants(
		clusterSentences,
		variantsOnly,
	)
	const docids = sentences.map(s => s.docid)
	const documents = (await fetchDocumentsByIds(db, docids)).filter(
		t => !!t,
	) as DbDocument[]
	const documentsById = documents.reduce((map, doc) => {
		map[doc.docid] = doc
		return map
	}, {} as Record<DocumentId, DbDocument>)

	// sort sentences by publication date
	return sentences
		.map(s => ({
			...s,
			text: textHash[s.sid],
			date: documentsById[s.docid].date,
		}))
		.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
}

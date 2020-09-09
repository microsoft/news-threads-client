/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { encoding } from '../util/format'
import { DbSentence, SentenceId, ClusterId, DbSentenceText } from './types'

const DEFAULT_GET_DEDUPE_KEY = (sentence: DbSentence) =>
	`${sentence.sid}-${sentence.sindex}`

/**
 * HACK:
 * XXX: dedup required, this is a bug in the pipeline *
 * see for example, dataset kamalaharris11-11, sentence 109108, which has three entries for doc 9334d4... in fragement_summaries.csv
 * @param sentences The sentences to deduplicate
 */
export function deduplicateSentences(
	sentences: DbSentence[],
	getKey = DEFAULT_GET_DEDUPE_KEY,
): DbSentence[] {
	return Object.values(
		sentences.reduce((acc, cur) => {
			acc[getKey(cur)] = cur
			return acc
		}, {} as Record<string, DbSentence>),
	)
}

/**
 * Dedups a list of numbers - these are usually numeric IDs
 * @param numbers
 */
export function dedupNumbers(numbers: number[]) {
	return Object.values(
		numbers.reduce((acc, cur) => {
			acc[cur] = cur
			return acc
		}, {} as Record<string, number>),
	)
}

/**
 * Get a list of all the sentence IDs and source-sentenceIds of the given sentence list.
 * @param sentences The sentences of interest
 */
export function getAllSentenceIds(sentences: DbSentence[]): SentenceId[] {
	return [
		...sentences
			.reduce((set, sentence) => {
				set.add(sentence.sid)
				set.add(sentence.sourceId)
				return set
			}, new Set<SentenceId>())
			.values(),
	]
}

/**
 * Extract cluster Ids out of a set of sentences
 */
export function getClusterIdsFromSentences(
	sentences: DbSentence[],
): ClusterId[] {
	return [
		...sentences.reduce((set, sentence) => {
			set.add(sentence.clusterId)
			return set
		}, new Set<ClusterId>()),
	]
}

/**
 * Set up a mapping of (ClusterId -> DbSentence[])
 * @param sentences The sentence list
 */
export function getClusterIdToSentenceMap(
	sentences: DbSentence[],
): Record<ClusterId, DbSentence[]> {
	return sentences.reduce((hash, sentence) => {
		const list = hash[sentence.clusterId] || []
		list.push(sentence)
		hash[sentence.clusterId] = list
		return hash
	}, {} as Record<ClusterId, DbSentence[]>)
}

/**
 * Counts the number of items in the sentence list with the given sentence id
 *
 * @param sid The sentence id
 * @param sentences The sentence ilst
 */
export function countInstancesOfSentence(
	sid: SentenceId,
	sentences: DbSentence[],
): number {
	return sentences.reduce(
		(count, cur) => (cur.sid === sid ? count + 1 : count),
		0,
	)
}

/**
 * Counts the number of unique sentences in the sentence list
 *
 * @param sentences The sentence list
 */
export function countUniqueSentences(sentences: DbSentence[]): number {
	return sentences.reduce((set, sentence) => {
		set.add(sentence.sid)
		return set
	}, new Set<SentenceId>()).size
}

/**
 * Get a map of SentenceId -> Sentence Text
 * @param texts
 */
export function getSentenceToTextMap(
	texts: DbSentenceText[],
): Record<SentenceId, string> {
	return texts.reduce((map, text) => {
		if (text.text) {
			// TODO: there is an issue with some of the scraped data which needs an encoding fix
			// at minimum we should fix on the way out of spark pipeline
			map[text.sid] = encoding(text.text)
		}
		return map
	}, {} as Record<SentenceId, string>)
}

/**
 * Get a map of SentenceId -> Sentence Text
 * @param texts
 */
export function getSentenceToSentenceTextMap(
	texts: DbSentence[],
): Record<SentenceId, DbSentence> {
	return texts.reduce((map, text) => {
		map[text.sid] = text
		return map
	}, {} as Record<SentenceId, DbSentence>)
}

/**
 * Filter down a set of sentence clusters to only unique variants where desired
 * @param clusterSentences
 * @param variantsOnly
 */
export function filterSentenceClustersToVariants(
	clusterSentences: DbSentence[],
	variantsOnly: boolean,
) {
	if (variantsOnly) {
		const hash = clusterSentences.reduce((acc, cur) => {
			const clusters = acc[cur.sid] || []
			clusters.push(cur)
			acc[cur.sid] = clusters
			return acc
		}, {} as Record<string, DbSentence[]>)
		// just grab the first doc from each cluster
		// NOTE: there could be some version of this where the publication order matters,
		// but that would require ingesting a date with each sentence
		const sentences = Object.values(hash).map(list => list[0])
		return sentences
	}
	return clusterSentences
}

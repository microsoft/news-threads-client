/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Document,
	Sentence,
	SentenceCluster,
} from '@newsthreads/schema/lib/provider-types'
import { DbSentenceWithStats, DbSentence } from '../data'
import { packId } from '../util'

export function createGQLSentence(
	sentence: DbSentence | DbSentenceWithStats,
	dataset: string,
): Sentence {
	return {
		...sentence,
		id: packSentenceId(sentence, dataset),
		document: {
			id: packId(sentence.docid, dataset),
			__typename: 'Document',
		} as Document,
		cid: sentence.clusterId,
		cluster: {
			id: packId(sentence.clusterId, dataset),
			__typename: 'SentenceCluster',
		} as SentenceCluster,
		__typename: 'Sentence',
	} as Sentence
}

/**
 * Unpack a global id
 * @param id The GQL id to unpack
 * @returns [dataset, sid, docid, sindex]
 */
export function unpackSentenceId(id: string): [string, number, string, number] {
	const [dataset, sid, docid, sindex] = id.split('|')
	return [dataset, +sid, docid, +sindex]
}

export function packSentenceId(sentence: DbSentence, dataset: string): string {
	return [dataset, sentence.sid, sentence.docid, sentence.sindex].join('|')
}

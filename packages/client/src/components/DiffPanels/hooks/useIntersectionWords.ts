/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Sentence } from '@newsthreads/schema/lib/client-types'
import { useMemo } from 'react'
import { complement } from '../../../util/sets'
import { useIntersection } from './useIntersection'

/**
 * For a pair of left/right sentence lists, this finds the
 * intersection based on source, then for each source
 * finds the non-shared words so we can highlight them.
 * @param leftSentences
 * @param rightSentences
 */
export function useIntersectionWords(
	leftSentences: Sentence[] | undefined,
	rightSentences: Sentence[] | undefined,
): Map<number, Set<string>> {
	const isect = useIntersection(leftSentences, rightSentences)
	// we have an interection of the sourceIds across the two documents
	// now, for each sentence on either side with a shared source,
	// we need a set of complement words, so we know what to emphasize as different
	const master = useMemo(() => {
		const map = new Map<number, string[]>()
		if (!leftSentences || !rightSentences) {
			return map
		}
		leftSentences.forEach(sentence => {
			if (isect.has(sentence.sourceId)) {
				const entry = map.get(sentence.sourceId) || []
				entry.push(sentence.text)
				map.set(sentence.sourceId, entry)
			}
		})
		rightSentences.forEach(sentence => {
			if (isect.has(sentence.sourceId)) {
				const entry = map.get(sentence.sourceId) || []
				entry.push(sentence.text)
				map.set(sentence.sourceId, entry)
			}
		})
		return map
	}, [leftSentences, rightSentences, isect])
	const complementMap = useMemo(() => {
		const map = new Map<number, Set<string>>()
		master.forEach((value, key) => {
			// note that there can actually be more than two, as sometimes a sentence is repeated
			const [left, right] = value
			const lWords = left.split(/\s/)
			const rWords = right.split(/\s/)
			const cWords = complement(new Set(lWords), new Set(rWords))
			map.set(key, cWords)
		})
		return map
	}, [master])
	return complementMap
}

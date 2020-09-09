/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sentence } from '@newsthreads/schema/lib/client-types'
import { useMemo } from 'react'
import { intersect } from '../../../util/sets'

/**
 * For a pair of left/right sentence lists, this finds
 * the intersection of sources based on sourceId.
 * @param leftSentences
 * @param rightSentences
 */
export function useIntersection(
	leftSentences: Sentence[] | undefined,
	rightSentences: Sentence[] | undefined,
): Set<number> {
	return useMemo(() => {
		if (!leftSentences || !rightSentences) {
			return new Set<number>()
		}
		const leftIds: number[] = leftSentences.map(s => s.sourceId)
		const rightIds: number[] = rightSentences.map(s => s.sourceId)
		return intersect<number>(new Set(leftIds), new Set(rightIds))
	}, [leftSentences, rightSentences])
}

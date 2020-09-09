/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Sentence } from '@newsthreads/schema/lib/client-types'
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'
import { useIntersection } from './useIntersection'

const BACKGROUND_OPACITY = 0.7
/**
 * For a pair of left/right sentence lists, this creates a
 * colors scale that allows synchronized highlighting across documents.
 * It does this by finding the master set of intersection IDs and
 * using that as the input keys to a nominal scale.
 * @param leftSentences
 * @param rightSentences
 */
export function useIntersectionColors(
	leftSentences: Sentence[] | undefined,
	rightSentences: Sentence[] | undefined,
): (id: number) => string {
	const theme = useThematic()
	const isect = useIntersection(leftSentences, rightSentences)
	const scale = useMemo(() => {
		const nominal = theme.scales().nominalMuted(Array.from(isect))
		return (id: number) =>
			isect.has(id) ? nominal(id).css(BACKGROUND_OPACITY) : 'none'
	}, [theme, isect])
	return scale
}

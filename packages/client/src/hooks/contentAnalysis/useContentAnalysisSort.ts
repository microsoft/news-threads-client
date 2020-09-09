/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState, ContentAnalysisSort, sortChanged } from '../../state'

export function useContentAnalysisSort(): [
	ContentAnalysisSort,
	(newSort: Partial<ContentAnalysisSort>) => void,
] {
	const dispatch = useDispatch()
	const sort: ContentAnalysisSort = useSelector(
		(state: AppState) => state.contentAnalysis.sort,
	)
	const setter = useCallback(
		(newSort: Partial<ContentAnalysisSort>) => {
			dispatch(sortChanged(newSort))
		},
		[dispatch],
	)

	return [sort, setter]
}

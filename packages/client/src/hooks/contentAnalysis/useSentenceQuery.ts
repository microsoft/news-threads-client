/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState, sentenceQueryChanged } from '../../state'

/**
 * A get/set hook for the current document sorting state
 */
export function useSentenceQuery(): [
	string | undefined,
	(newQuery: string) => void,
] {
	const dispatch = useDispatch()
	const query = useSelector((state: AppState) => state.contentAnalysis.query)

	const setQuery = useCallback(
		(newQuery: string) => {
			dispatch(sentenceQueryChanged(newQuery))
		},
		[dispatch],
	)

	return [query, setQuery]
}

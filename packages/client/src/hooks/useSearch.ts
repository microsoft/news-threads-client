/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	AppState,
	SearchState,
	searchPartChanged,
	selectedDocumentIdChanged,
} from '../state'

export function useSearch<T extends string | number>(
	searchKey: keyof SearchState,
): [T, (newValue: T) => void] {
	const dispatch = useDispatch()
	const searchPart = useSelector((state: AppState) => state.search[searchKey])

	const setSearchPart = useCallback(
		(value: T) => {
			// Clear the selected document ID when making new searches
			dispatch(selectedDocumentIdChanged(null))
			dispatch(searchPartChanged([searchKey, value]))
		},
		[dispatch, searchKey],
	)

	return [searchPart as T, setSearchPart]
}

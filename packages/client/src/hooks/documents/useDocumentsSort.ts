/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	AppState,
	DocumentSort,
	documentSortChanged,
	DocumentSortBy,
	DocumentSortDirection,
	selectedDocumentIdChanged,
} from '../../state'

/**
 * A get/set hook for the current document sorting state
 */
export function useDocumentSort(): [
	DocumentSort,
	(newSort: Partial<DocumentSort>) => void,
] {
	const dispatch = useDispatch()
	const sort: DocumentSort = useSelector(
		(state: AppState) => state.documents.sort,
	)

	const setSort = useCallback(
		(newSort: Partial<DocumentSort>) => {
			// text score can only be sorted in descending order
			if (newSort.by && newSort.by === DocumentSortBy.Score) {
				newSort.direction = DocumentSortDirection.Descending
			}

			// Clear selected document ID when making new searches
			dispatch(selectedDocumentIdChanged(null))
			dispatch(documentSortChanged(newSort))
		},
		[dispatch],
	)

	return [sort, setSort]
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState, selectedDocumentIdChanged } from '../../state'

export function useSelectedDocumentId(): [
	string | null,
	(id: string | null) => void,
] {
	const dispatch = useDispatch()
	const selectedDocumentId = useSelector(
		(state: AppState) => state.documents.selectedDocumentId,
	)

	const setSelectedDocumentId = useCallback(
		(documentId: string | null) => {
			dispatch(selectedDocumentIdChanged(documentId))
		},
		[dispatch],
	)

	return [selectedDocumentId, setSelectedDocumentId]
}

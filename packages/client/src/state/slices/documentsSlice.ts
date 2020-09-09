/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum DocumentSortBy {
	Score = 'Relevance',
	DomainScore = 'Site',
	Variation = 'Variation',
	Duplication = 'Duplication',
	Date = 'Date',
}

export enum DocumentSortDirection {
	Ascending = 'Ascending',
	Descending = 'Descending',
}

export interface DocumentSort {
	by: DocumentSortBy
	direction: DocumentSortDirection
}

interface DocumentsState {
	selectedDocumentId: string | null
	sort: DocumentSort
}

const initialState: DocumentsState = {
	selectedDocumentId: null,
	sort: {
		by: DocumentSortBy.Date,
		direction: DocumentSortDirection.Descending,
	},
}

const documentsSlice = createSlice({
	name: 'documents',
	initialState,
	reducers: {
		selectedDocumentIdChanged: (
			state,
			{ payload }: PayloadAction<string | null>,
		) => {
			state.selectedDocumentId = payload
			return state
		},
		setSelectedDocumentIdIfNull: (
			state,
			{ payload }: PayloadAction<string | null>,
		) => {
			if (!state.selectedDocumentId) {
				state.selectedDocumentId = payload
			}
			return state
		},
		documentSortChanged: (
			state,
			{ payload }: PayloadAction<Partial<DocumentSort>>,
		) => {
			state.sort = {
				...state.sort,
				...payload,
			}
			return state
		},
	},
})

export const {
	selectedDocumentIdChanged,
	documentSortChanged,
	setSelectedDocumentIdIfNull,
} = documentsSlice.actions

export const documentsReducer = documentsSlice.reducer

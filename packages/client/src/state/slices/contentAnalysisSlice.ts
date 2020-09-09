/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	SentenceCluster,
	SentenceClusterSortBy,
	SortDirection,
} from '@newsthreads/schema/lib/client-types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface ContentAnalysisSort {
	by: SentenceClusterSortBy
	direction: SortDirection
}

interface ContentAnalysisState {
	sort: ContentAnalysisSort
	sentenceClusters: SentenceCluster[]
	query?: string
}

const initialState: ContentAnalysisState = {
	sort: {
		by: 'Instances',
		direction: 'Descending',
	},
	sentenceClusters: [],
}

export interface SentenceClusterQuery {
	sort: ContentAnalysisSort
	dataset: string
	limit: number
}

const contentAnalysisSlice = createSlice({
	name: 'contentAnalysis',
	initialState,
	reducers: {
		sortChanged: (
			state,
			{ payload }: PayloadAction<Partial<ContentAnalysisSort>>,
		) => {
			state.sort = {
				...state.sort,
				...payload,
			}
		},
		sentenceQueryChanged: (state, { payload }: PayloadAction<string>) => {
			state.query = payload
		},
	},
})

export const {
	sortChanged,
	sentenceQueryChanged,
} = contentAnalysisSlice.actions

export const contentAnalysisReducer = contentAnalysisSlice.reducer

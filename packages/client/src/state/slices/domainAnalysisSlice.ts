/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	SortDirection,
	DomainStatsSortBy,
	DomainStats,
} from '@newsthreads/schema/lib/client-types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface DomainAnalysisSort {
	by: DomainStatsSortBy
	direction: SortDirection
}

interface DomainAnalysisState {
	sort: DomainAnalysisSort
	domains: DomainStats[]
	query?: string
}

const initialState: DomainAnalysisState = {
	sort: {
		by: 'Documents',
		direction: 'Descending',
	},
	domains: [],
}

export interface DomainStatsQuery {
	sort: DomainAnalysisSort
	dataset: string
	count: number
}

const domainAnalysisSlice = createSlice({
	name: 'domainAnalysis',
	initialState,
	reducers: {
		domainSortChanged: (
			state,
			{ payload }: PayloadAction<Partial<DomainAnalysisSort>>,
		) => {
			state.sort = {
				...state.sort,
				...payload,
			}
		},
		domainQueryChanged: (state, { payload }: PayloadAction<string>) => {
			state.query = payload
		},
	},
})

export const {
	domainSortChanged,
	domainQueryChanged,
} = domainAnalysisSlice.actions

export const domainAnalysisReducer = domainAnalysisSlice.reducer

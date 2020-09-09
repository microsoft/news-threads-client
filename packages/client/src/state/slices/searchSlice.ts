/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SearchState {
	query: string
	domain: string
	from: string
	to: string
	minDomainScore: number
	maxDomainScore: number
	minInstanceVariantRatio: number
	maxInstanceVariantRatio: number
	minInstanceDuplicateRatio: number
	maxInstanceDuplicateRatio: number
	offset: number
	count: number
}

export const initialSearchState: SearchState = {
	query: '',
	domain: '',
	from: '',
	to: '',
	minDomainScore: 0,
	maxDomainScore: 100,
	minInstanceVariantRatio: 0,
	maxInstanceVariantRatio: 1,
	minInstanceDuplicateRatio: 0,
	maxInstanceDuplicateRatio: 1,
	offset: 0,
	count: CONFIG.search.count,
}

const searchSlice = createSlice({
	name: 'search',
	initialState: initialSearchState,
	reducers: {
		searchPartChanged: <T extends string | number>(
			state,
			{ payload: [key, value] }: PayloadAction<[keyof SearchState, T]>,
		) => {
			state[key] = value
			// reset to first page with new searches
			if (key !== 'offset') {
				state.offset = 0
			}
			return state
		},
		resetSearch: () => {
			return {
				...initialSearchState,
			}
		},
	},
})

export const { searchPartChanged, resetSearch } = searchSlice.actions

export const searchReducer = searchSlice.reducer

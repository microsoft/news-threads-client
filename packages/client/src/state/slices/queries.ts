/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type QueriesState = string[]

const initialState: QueriesState = [
	'coronavirus',
	'covid',
	'wuhan',
	'5g',
	'hoax',
	'bioweapon',
	'conspiracy',
	'bill gates',
	'vaccine',
	'protest',
	'lockdown',
	'hydroxychloroquine',
	'chloroquine',
	'remdesivir',
	'azithromycin',
	'ibuprofen',
	'colloidal silver',
	'arsenicum album',
]

const queriesSlice = createSlice({
	name: 'queries',
	initialState,
	reducers: {
		addQuery: (state, action: PayloadAction<string>) => {
			// don't allow duplicates of the same query
			const found = state.some(q => q === action.payload)
			if (found) {
				return state
			}
			return [...state, action.payload]
		},
		removeQuery: (state, action: PayloadAction<string>) => {
			return state.filter(q => q !== action.payload)
		},
		clearQueries: () => [],
		resetQueries: () => [...initialState],
	},
})

export const {
	addQuery,
	removeQuery,
	clearQueries,
	resetQueries,
} = queriesSlice.actions

export const queriesReducer = queriesSlice.reducer

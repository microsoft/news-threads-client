/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Diff {
	id: string | null
}

interface DiffState {
	left: Diff
	right: Diff
}

const initialState: DiffState = {
	left: {
		id: null,
	},
	right: {
		id: null,
	},
}

export enum DiffSide {
	Left,
	Right,
}

export interface DiffPayload {
	side: DiffSide
}

const diffSlice = createSlice({
	name: 'diff',
	initialState,
	reducers: {
		diffIdChanged: (
			state,
			{ payload }: PayloadAction<DiffPayload & { id: string | null }>,
		) => {
			const diffKey = DiffSide[payload.side].toLowerCase()
			state[diffKey] = {
				id: payload.id,
			}
		},
	},
})

export const { diffIdChanged } = diffSlice.actions

export const diffReducer = diffSlice.reducer

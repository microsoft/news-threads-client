/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThemeVariant } from '@thematic/core'

interface ThemeState {
	variant: ThemeVariant
}

const initialState: ThemeState = {
	variant: ThemeVariant.Light,
}

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		changed: (_state, { payload }: PayloadAction<ThemeVariant>) => {
			return { variant: payload }
		},
	},
})

export const { changed: themeChanged } = themeSlice.actions

export const themeReducer = themeSlice.reducer

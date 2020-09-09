/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DatasetState {
	value: string
}

const initialState: DatasetState = {
	value: '',
}

const reducer = (state, action: PayloadAction<string>) => {
	return { value: action.payload }
}

const datasetSlice = createSlice({
	name: 'dataset',
	initialState,
	reducers: {
		// Side effects run when the dataset is changed in the UI
		// to clear out the current state persisted in the URL
		changed: reducer,
		// Need a way to set the dataset without running side effects
		// on page load
		setDataset: reducer,
	},
})

export const { changed: datasetChanged, setDataset } = datasetSlice.actions

export const datasetReducer = datasetSlice.reducer

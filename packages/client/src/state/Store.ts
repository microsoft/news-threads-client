/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { ThemeVariant } from '@thematic/core'
import { createEpicMiddleware } from 'redux-observable'
import { getPreferredThemeVariant } from '../resources/localStorage'
import {
	watchSystemPreferredThemeVariant,
	getSystemPreferredThemeVariant,
} from '../resources/mediaQueries'
import { rootEpic } from './epics'
import {
	contentAnalysisReducer,
	domainAnalysisReducer,
	documentsReducer,
	datasetReducer,
	searchReducer,
	themeReducer,
	diffReducer,
	themeChanged,
	queriesReducer,
} from './slices'

const epicMiddleware = createEpicMiddleware()

export const store = configureStore({
	reducer: {
		dataset: datasetReducer,
		search: searchReducer,
		theme: themeReducer,
		diff: diffReducer,
		documents: documentsReducer,
		contentAnalysis: contentAnalysisReducer,
		domainAnalysis: domainAnalysisReducer,
		queries: queriesReducer,
	},
	preloadedState: {
		theme: {
			variant:
				getPreferredThemeVariant() ||
				getSystemPreferredThemeVariant() ||
				ThemeVariant.Light,
		},
	},
	middleware: [
		...getDefaultMiddleware({
			serializableCheck: {
				ignoredPaths: ['auth'],
				// Ignore react-aad-msal actions
				// https://github.com/syncweek-react-aad/react-aad#integrating-with-a-redux-store
				ignoredActions: [
					'AAD_AUTHENTICATED_STATE_CHANGED',
					'AAD_ACQUIRED_ID_TOKEN_SUCCESS',
					'AAD_ACQUIRED_ID_TOKEN_ERROR',
					'AAD_ACQUIRED_ACCESS_TOKEN_SUCCESS',
					'AAD_ACQUIRED_ACCESS_TOKEN_ERROR',
					'AAD_LOGIN_SUCCESS',
					'AAD_LOGIN_ERROR',
				],
			},
		}),
		epicMiddleware,
	],
})

epicMiddleware.run(rootEpic)
watchSystemPreferredThemeVariant(theme => store.dispatch(themeChanged(theme)))

export type AppState = ReturnType<typeof store.getState>

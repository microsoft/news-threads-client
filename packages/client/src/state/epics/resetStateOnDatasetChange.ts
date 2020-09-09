/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PayloadAction } from '@reduxjs/toolkit'
import { Epic, ofType, StateObservable } from 'redux-observable'
import { mergeMap, withLatestFrom, pairwise } from 'rxjs/operators'

import { AppState } from '..'
import {
	datasetChanged,
	resetSearch,
	selectedDocumentIdChanged,
	documentSortChanged,
	DocumentSortBy,
	DocumentSortDirection,
	diffIdChanged,
	DiffSide,
} from '../slices'

export const resetStateOnDatasetChange: Epic = (
	action$,
	state$: StateObservable<AppState>,
) => {
	const statePair$ = state$.pipe(pairwise())

	return action$.pipe(
		ofType(datasetChanged.type),
		withLatestFrom(statePair$),
		mergeMap(
			([action, [oldState, newState]]: [
				PayloadAction<string>,
				[AppState, AppState],
			]) => {
				// Reset search, documents and diff states when new dataset is selected
				if (
					oldState.dataset.value &&
					newState.dataset.value &&
					oldState.dataset.value !== newState.dataset.value
				) {
					return [
						selectedDocumentIdChanged(null),
						resetSearch(),
						documentSortChanged({
							by: DocumentSortBy.Date,
							direction: DocumentSortDirection.Descending,
						}),
						diffIdChanged({
							side: DiffSide.Left,
							id: null,
						}),
						diffIdChanged({
							side: DiffSide.Right,
							id: null,
						}),
					]
				}
				return []
			},
		),
	)
}

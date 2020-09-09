/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Action } from '@reduxjs/toolkit'
import { Epic, ofType, StateObservable } from 'redux-observable'
import { mergeMap, catchError } from 'rxjs/operators'

export interface PersistStateToUrlProps<T> {
	actions: string[]
	stateToQueryString: (state: T) => string
	errorHandler: (error: unknown) => Action[]
}

export function persistStateToUrl<T>({
	actions,
	stateToQueryString,
	errorHandler,
}: PersistStateToUrlProps<T>): Epic {
	return (action$, state$: StateObservable<T>) => {
		return action$.pipe(
			ofType(...actions),
			mergeMap(() => {
				// Add search string to current url path
				const searchString = stateToQueryString(state$.value)
				const { location: l } = window
				const uri = `${l.pathname}?${searchString}${l.hash}`

				// Push new search string into history state
				// instead of setting window.location.
				// Setting window.location causes react router to rerender the whole page.
				window.history.pushState('', searchString, uri)
				return []
			}),
			catchError(errorHandler),
		)
	}
}

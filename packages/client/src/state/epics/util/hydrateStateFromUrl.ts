/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Action } from '@reduxjs/toolkit'
import { Epic, ofType } from 'redux-observable'
import { catchError, mergeMap } from 'rxjs/operators'
import { parseQuery } from '../../../util/parseQuery'

export type QueryParameterKeyValuePair = [string, string | string[]]
export type QueryActionMapper = Record<
	string,
	(parameter: QueryParameterKeyValuePair) => Action
>

export interface HydrateStateFromUrlProps {
	actions: string[]
	queryMapper: QueryActionMapper
	errorHandler: (error: unknown) => Action[]
	skipNullOrEmptyQueryParameterValues?: boolean
}

export function hydrateStateFromUrl({
	actions,
	queryMapper,
	errorHandler,
	skipNullOrEmptyQueryParameterValues = false,
}: HydrateStateFromUrlProps): Epic {
	return (action$, state$) => {
		return action$.pipe(
			ofType(...actions),
			mergeMap(() => {
				const query = parseQuery()

				// map query parameters to redux actions
				return Object.entries(queryMapper).reduce<Action[]>(
					(actions, [key, mapper]) => {
						const value = query[key]
						// if query parameter exist in url then map it to redux action.
						if (value != null || !skipNullOrEmptyQueryParameterValues) {
							const keyValuePair: QueryParameterKeyValuePair = [
								key,
								value || '',
							]
							return [...actions, mapper(keyValuePair)]
						}
						return actions
					},
					[],
				)
			}),
			catchError(errorHandler),
		)
	}
}

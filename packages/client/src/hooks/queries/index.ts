/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
	AppState,
	addQuery,
	removeQuery,
	resetQueries,
	clearQueries,
} from '../../state'

export function useQueries(): string[] {
	return useSelector((state: AppState) => state.queries)
}

export function useAddQuery(): (addValue: string) => void {
	const dispatch = useDispatch()
	return useCallback(
		(value: string) => {
			dispatch(addQuery(value))
		},
		[dispatch],
	)
}

export function useRemoveQuery(): (removeValue: string) => void {
	const dispatch = useDispatch()
	return useCallback(
		(value: string) => {
			dispatch(removeQuery(value))
		},
		[dispatch],
	)
}

export function useClearQueries(): () => void {
	const dispatch = useDispatch()
	return useCallback(() => {
		dispatch(clearQueries())
	}, [dispatch])
}

export function useResetQueries(): () => void {
	const dispatch = useDispatch()
	return useCallback(() => {
		dispatch(resetQueries())
	}, [dispatch])
}

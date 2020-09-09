/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState, domainQueryChanged } from '../../state'

export function useDomainQuery(): [
	string | undefined,
	(newQuery: string) => void,
] {
	const dispatch = useDispatch()
	const query = useSelector((state: AppState) => state.domainAnalysis.query)

	const setQuery = useCallback(
		(newQuery: string) => {
			dispatch(domainQueryChanged(newQuery))
		},
		[dispatch],
	)

	return [query, setQuery]
}

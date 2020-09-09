/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState, DomainAnalysisSort, domainSortChanged } from '../../state'

export function useDomainAnalysisSort(): [
	DomainAnalysisSort,
	(newSort: Partial<DomainAnalysisSort>) => void,
] {
	const dispatch = useDispatch()
	const sort: DomainAnalysisSort = useSelector(
		(state: AppState) => state.domainAnalysis.sort,
	)
	const setter = useCallback(
		(newSort: Partial<DomainAnalysisSort>) => {
			dispatch(domainSortChanged(newSort))
		},
		[dispatch],
	)

	return [sort, setter]
}

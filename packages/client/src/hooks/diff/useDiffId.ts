/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState, diffIdChanged, DiffSide } from '../../state'

export function useDiffId(
	side: DiffSide,
): [string | null, (docId: string | null) => void] {
	const diffKey = DiffSide[side].toLowerCase()
	const dispatch = useDispatch()
	const docid = useSelector((state: AppState) => state.diff[diffKey].id)

	const setter = useCallback(
		(docId: string | null) => {
			dispatch(
				diffIdChanged({
					side,
					id: docId,
				}),
			)
		},
		[dispatch, side],
	)

	return [docid, setter]
}

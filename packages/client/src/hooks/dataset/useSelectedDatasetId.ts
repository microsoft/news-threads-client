/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppState, datasetChanged, setDataset } from '../../state'
import { useDatasets } from './useDatasets'

/**
 * A get/set hook for the selected dataset id
 */
export function useSelectedDatasetId(): [string, (dataset: string) => void] {
	const dispatch = useDispatch()
	const datasetId = useSelector((state: AppState) => state.dataset.value)
	const setDatasetId = useCallback(
		(dataset: string) => {
			dispatch(datasetChanged(dataset))
		},
		[dispatch],
	)

	const [datasets] = useDatasets()

	const defaultDatasetId = useMemo(() => {
		return datasets.find(d => d.default)?.id || datasets[0]?.id || ''
	}, [datasets])

	useEffect(
		function loadDataset() {
			// Select dataset if currently empty or if currently
			// selected dataset does not exist (dataset provided through url does not exist)
			if (
				(!datasetId || !datasets.find(d => d.id === datasetId)) &&
				defaultDatasetId
			) {
				dispatch(setDataset(defaultDatasetId))
			}
		},
		[datasetId, datasets, defaultDatasetId, dispatch],
	)

	return [datasetId, setDatasetId]
}

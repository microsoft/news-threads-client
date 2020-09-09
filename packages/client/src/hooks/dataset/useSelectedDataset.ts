/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dataset } from '@newsthreads/schema/lib/client-types'
import { useDatasetWithId } from './useDatasetWithId'
import { useSelectedDatasetId } from './useSelectedDatasetId'

/**
 * Gets the selected dataset object
 */
export function useSelectedDataset(): Dataset | undefined {
	const [dataset] = useSelectedDatasetId()
	return useDatasetWithId(dataset)
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dataset } from '@newsthreads/schema/lib/client-types'
import { useMemo } from 'react'
import { useDatasets } from './useDatasets'

/**
 * A hook to query a dataset with a given id
 */
export function useDatasetWithId(id: string): Dataset | undefined {
	const [datasets] = useDatasets()
	return useMemo(() => datasets.find(d => d.id === id), [id, datasets])
}

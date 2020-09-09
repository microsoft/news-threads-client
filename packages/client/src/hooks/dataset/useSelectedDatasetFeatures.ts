/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DatasetFeatureFlags } from '@newsthreads/schema/lib/client-types'
import { useSelectedDataset } from './useSelectedDataset'

/**
 * Gets the feature flags for the selected dataset object
 */
export function useSelectedDatasetFeatures(): DatasetFeatureFlags {
	const dataset = useSelectedDataset()
	const features = dataset?.features || {}
	return features
}

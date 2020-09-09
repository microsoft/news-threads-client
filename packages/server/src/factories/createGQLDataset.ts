/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dataset } from '@newsthreads/schema/lib/provider-types'
import { DbDataset } from '../data'

export function createGQLDataset(dataset: DbDataset): Dataset {
	return {
		...dataset,
		features: {
			...dataset.features,
			__typename: 'DatasetFeatureFlags',
		},
	}
}

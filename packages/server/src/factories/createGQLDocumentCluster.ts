/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DocumentCluster } from '@newsthreads/schema/lib/provider-types'
import { DbCluster } from '../data'
import { packId } from '../util'

export function createGQLDocumentCluster(
	dataset: string,
	cluster: DbCluster,
): DocumentCluster {
	return {
		...cluster,
		id: packId(cluster.clusterId, dataset),
		documentCount: cluster.documentCount,
		documents: [],
		__typename: 'DocumentCluster',
	}
}

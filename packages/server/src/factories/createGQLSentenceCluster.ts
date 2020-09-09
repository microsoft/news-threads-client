/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SentenceCluster } from '@newsthreads/schema/lib/provider-types'
import { DbSentenceCluster } from '../data'

export function createGQLSentenceCluster(
	cluster: DbSentenceCluster,
	dataset: string,
): SentenceCluster {
	return {
		...cluster,
		id: `${dataset}|${cluster.clusterId}`,
		__typename: 'SentenceCluster',
	} as SentenceCluster
}

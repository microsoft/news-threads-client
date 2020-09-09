/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DocumentClusterResolvers } from '@newsthreads/schema/lib/provider-types'
import { queryClusterDocuments, queryClusterDocumentCount } from '../data'
import { createGQLDocument } from '../factories'
import { unpackId } from '../util'

export const DocumentCluster: DocumentClusterResolvers = {
	async documentCount(parent) {
		const [dataset] = unpackId(parent.id)
		return queryClusterDocumentCount(dataset, {
			clusterId: parent.clusterId,
			epsilon: parent.epsilon,
		})
	},

	async documents(parent, _args, _context, _info) {
		const [dataset, clusterId] = unpackId(parent.id)
		const { epsilon } = parent
		const results = await queryClusterDocuments(dataset, epsilon, +clusterId)
		return results.map(r => createGQLDocument(r, dataset))
	},
}

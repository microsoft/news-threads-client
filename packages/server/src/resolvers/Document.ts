/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Domain,
	DocumentResolvers,
} from '@newsthreads/schema/lib/provider-types'
import { queryDocumentClusters, querySentencesWithTexts } from '../data'
import {
	createGQLDomain,
	createGQLDocumentCluster,
	createGQLSentence,
	createGQLDocstats,
} from '../factories'
import { unpackId } from '../util'
import { ServerGqlContext } from './types'

export const Document: DocumentResolvers = {
	/**
	 * Resolve the domain on a document
	 */
	async domain(
		parent,
		_args,
		{ dataSources }: ServerGqlContext,
		_info,
	): Promise<Domain> {
		const result = await dataSources.domains.load(parent.domain.domain)
		if (!result) {
			return parent.domain
		}
		return createGQLDomain(result)
	},

	/**
	 * Resolve the clusters on a document
	 */
	async clusters(parent, args, _context, _info) {
		const [dataset, docid] = unpackId(parent.id)
		const result = await queryDocumentClusters(
			dataset,
			docid,
			args.epsilon,
			false,
		)
		return result.map(cluster => createGQLDocumentCluster(dataset, cluster))
	},

	/**
	 * Resolve sentences on a document
	 */
	async sentences(parent, _args, _context, _info) {
		const [dataset, docid] = unpackId(parent.id)
		const sentences = await querySentencesWithTexts(dataset, docid)
		return sentences.map(r => createGQLSentence(r, dataset))
	},

	/**
	 * Resolve the stats on a document
	 */
	async stats(parent, _args, { dataSources }: ServerGqlContext, _info) {
		const [dataset] = unpackId(parent.id)
		const stats = await dataSources.documentStats.load(parent.id)
		if (!stats) {
			return parent.stats
		}
		return createGQLDocstats(stats, dataset)
	},
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { QueryResolvers, Dataset } from '@newsthreads/schema/lib/provider-types'
import {
	queryDocument,
	queryDocuments,
	queryDatasets,
	queryDailyTermCounts,
	findOrderedSentenceClusters,
	queryDocumentSources,
	queryDailyQueryTokenCounts,
	querySentenceInstances,
	queryDomain,
	queryDocumentStats,
} from '../data'
import { queryDomainsStats } from '../data/queries/queryDomainsStats'
import {
	createGQLDocument,
	createGQLDocumentsResultPage,
	createGQLDataset,
	createGQLSentenceCluster,
	createGQLDailyTermCount,
	createGQLSentence,
	createGQLDomain,
	createGQLDocstats,
} from '../factories'
import { createGQLDomainStatsResultPage } from '../factories/createGQLDomainStatsResultPage'
import { unpackId } from '../util'
import {
	unpackDomainRating,
	unpackDocumentSortBy,
	unpackSentenceClusterSortBy,
	unpackSortDirection,
	unpackDomainStatsSortBy,
} from './args'

export const Query: QueryResolvers = {
	/**
	 * Query for Datasets
	 */
	async datasets() {
		const datasets = await queryDatasets()
		return datasets.map(d => createGQLDataset(d)) as Dataset[]
	},

	/**
	 * Query for Single Document
	 */
	async document(_parent, { id }, _context, _info) {
		const [dataset, docid] = unpackId(id)
		const document = await queryDocument(dataset, docid)
		if (!document) {
			return null
		}
		return createGQLDocument(document, dataset)
	},

	/**
	 * Query for a single domain
	 */
	async domain(_parent, { id }) {
		const domain = await queryDomain(id)
		if (domain == null) {
			return null
		}
		return createGQLDomain(domain)
	},

	/**
	 * Query for single document stats.
	 */
	async documentStats(_parent, { id }) {
		const [dataset, docid] = unpackId(id)
		const document = await queryDocumentStats(dataset, docid)
		if (!document) {
			return null
		}
		return createGQLDocstats(document, dataset)
	},

	/**
	 * Query for documents
	 */
	async documents(
		_parent,
		{
			count,
			offset,
			query,
			dataset,
			domain,
			sortBy,
			sortDirection,
			domainRating,
			minDate,
			maxDate,
			maxDomainScore,
			minDomainScore,
			minInstanceVariantRatio,
			maxInstanceVariantRatio,
			minInstanceDuplicateRatio,
			maxInstanceDuplicateRatio,
		},
		_context,
		_info,
	) {
		const sort = unpackDocumentSortBy(sortBy)
		const dir = unpackSortDirection(sortDirection)
		const [documents, totalCount] = await queryDocuments({
			dataset,
			query,
			limit: count,
			offset,
			domain,
			maxDate,
			minDate,
			minDomainScore,
			maxDomainScore,
			minInstanceVariantRatio,
			maxInstanceVariantRatio,
			minInstanceDuplicateRatio,
			maxInstanceDuplicateRatio,
			domainRating: unpackDomainRating(domainRating),
			sort,
			dir,
		})
		return createGQLDocumentsResultPage(documents, dataset, offset, totalCount)
	},

	async domainStats(
		_parent,
		{
			count,
			offset,
			dataset,
			domain,
			sortBy,
			sortDirection,
			domainRating,
			maxDomainScore,
			minDomainScore,
		},
		_context,
		_info,
	) {
		const sort = unpackDomainStatsSortBy(sortBy)
		const dir = unpackSortDirection(sortDirection)
		const [domains, totalCount] = await queryDomainsStats({
			dataset,
			limit: count,
			offset,
			domain,
			minDomainScore,
			maxDomainScore,
			domainRating: unpackDomainRating(domainRating),
			sort,
			dir,
		})
		return createGQLDomainStatsResultPage(domains, dataset, offset, totalCount)
	},
	/**
	 * Get textual sources for a document
	 */
	async sourceDocuments(_parent, { id }) {
		const [dataset, docid] = unpackId(id)
		const results = await queryDocumentSources(dataset, docid)
		return results.map(doc => createGQLDocument(doc, dataset))
	},

	/**
	 * Query for daily term counts
	 */
	async dailyTermAggregate(
		_parent,
		{ aggregate, dataset, term, startDate, endDate },
	) {
		term = term.toLowerCase()
		if (aggregate === 'Terms') {
			const results = await queryDailyTermCounts(dataset, term, [
				startDate as string,
				endDate as string,
			])
			return results.map(t => createGQLDailyTermCount(t))
		} else if (aggregate === 'Queries') {
			const results = await queryDailyQueryTokenCounts(
				dataset,
				term as string,
				[startDate as string, endDate as string],
			)
			return results.map(t => createGQLDailyTermCount(t))
		} else {
			throw new Error(`unknown aggregate: ${aggregate}`)
		}
	},

	/**
	 * Query for Sentence Clusters
	 */
	async sentenceClusters(_parent, { dataset, sort, dir, limit, query }) {
		const results = await findOrderedSentenceClusters(
			dataset,
			unpackSentenceClusterSortBy(sort),
			unpackSortDirection(dir),
			limit,
			query as string,
		)
		return results.map(r => createGQLSentenceCluster(r, dataset))
	},

	/**
	 * Query for sentence instances matching a given sentence
	 */
	async sentenceInstances(_parent, { dataset, sid, variantsOnly }) {
		const results = await querySentenceInstances(
			dataset,
			sid,
			variantsOnly as boolean,
		)
		return results.map(s => createGQLSentence(s, dataset))
	},
}

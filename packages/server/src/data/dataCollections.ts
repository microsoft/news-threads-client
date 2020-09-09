/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'
import { MongoClient } from 'mongodb'
import { getClient } from './client'
import { DatasetId } from './types'

const log = debug('newsthreads:db')

type Collections =
	| 'dailyCounts'
	| 'docsearch'
	| 'documents'
	| 'fragmentSummaries'
	| 'sentenceClusterSummaries'
	| 'sentenceIdLookup'
	| 'docstats'
	| 'domainSummaries'
	| 'queryCounts'
	| 'joinedClusterLabels'
	| 'datasets'
	| 'domains'

/**
 * Cache a record of available collections per dataset.
 */
const datasetCollections: Record<DatasetId, Record<Collections, string>> = {}

const defaultCollectionNames: Record<Collections, string> = {
	dailyCounts: 'daily_counts',
	docsearch: 'documents',
	documents: 'documents',
	fragmentSummaries: 'fragment_summaries',
	sentenceClusterSummaries: 'sentence_cluster_summaries',
	sentenceIdLookup: 'sentence_id_lookup',
	docstats: 'PRECOMPUTE_docstats',
	domainSummaries: 'PRECOMPUTE_domain_summaries',
	queryCounts: 'PRECOMPUTE_query_counts',
	joinedClusterLabels: 'joined_cluster_labels',
	datasets: 'datasets',
	domains: 'domains',
}

/**
 * Cache available collections for the provided dataset
 * @param dataset dataset id
 */
async function configureCollectionNames(dataset: DatasetId) {
	const collectionNames = { ...defaultCollectionNames }

	const client: MongoClient = await getClient(dataset)
	const db = client.db()
	const collections = await db.collections()

	// set docsearch collection name
	if (collections.find(c => c.collectionName === 'PRECOMPUTE_docsearch')) {
		console.error('FOUND PRECOMPUTE_DOCSEARCH')
		collectionNames.docsearch = 'PRECOMPUTE_docsearch'
	} else if (collections.find(c => c.collectionName === 'docsearch')) {
		collectionNames.docsearch = 'docsearch'
	}

	// fragment summaries
	if (collections.find(c => c.collectionName === 'fragment_summaries_lsh')) {
		collectionNames.fragmentSummaries = 'fragment_summaries_lsh'
	}

	// sentence cluster summaries
	if (
		collections.find(
			c => c.collectionName === 'PRECOMPUTE_sentence_cluster_summaries',
		)
	) {
		collectionNames.fragmentSummaries = 'PRECOMPUTE_sentence_cluster_summaries'
	}

	datasetCollections[dataset] = collectionNames
}

/**
 * Return available collections for the provided dataset
 */
export async function getCollectionNames(dataset: DatasetId) {
	log(`dataset: ${dataset}`)
	if (!datasetCollections[dataset]) {
		await configureCollectionNames(dataset)
	}
	const collections = datasetCollections[dataset] ?? defaultCollectionNames
	log(JSON.stringify(collections, undefined, 2))
	return collections
}

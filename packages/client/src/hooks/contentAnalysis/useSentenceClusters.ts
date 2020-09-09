/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useQuery } from '@apollo/client'
import { SentenceCluster } from '@newsthreads/schema/lib/client-types'
import { useSelectedDatasetId } from '../dataset'
import { useContentAnalysisSort } from './useContentAnalysisSort'
import { useSentenceQuery } from './useSentenceQuery'

const QUERY_LIMIT = 100

const FETCH_SENTENCE_CLUSTERS = gql`
	query getSentenceClusters(
		$dataset: String!
		$sort: SentenceClusterSortBy!
		$dir: SortDirection!
		$limit: Long!
		$query: String
	) {
		sentenceClusters(
			dataset: $dataset
			sort: $sort
			dir: $dir
			limit: $limit
			query: $query
		) {
			id
			clusterId
			sourceId
			instanceCount
			duplicateCount
			variantCount
			instanceVariantRatio
			instanceDuplicateRatio
			sourceSentenceText
		}
	}
`

const NO_DATA = Object.freeze([])

export function useSentenceClusters(): [SentenceCluster[], boolean] {
	const [dsid] = useSelectedDatasetId()
	const [{ by: sort, direction: dir }] = useContentAnalysisSort()
	const [query] = useSentenceQuery()

	const { loading, error, data } = useQuery(FETCH_SENTENCE_CLUSTERS, {
		variables: {
			dataset: dsid,
			sort,
			dir,
			limit: QUERY_LIMIT,
			query,
		},
	})

	if (error) {
		console.error('error loading sentence clusters', error)
	}
	return [data?.sentenceClusters || NO_DATA, loading]
}

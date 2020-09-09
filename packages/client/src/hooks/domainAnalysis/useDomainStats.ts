/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useQuery } from '@apollo/client'
import { DomainStats } from '@newsthreads/schema/lib/client-types'
import { useSelectedDatasetId } from '../dataset'
import { useDomainAnalysisSort } from './useDomainAnalysisSort'
import { useDomainQuery } from './useDomainQuery'

const QUERY_LIMIT = 250

const FETCH_DOMAINS = gql`
	query getDomainStats(
		$dataset: String!
		$domain: String
		$sortBy: DomainStatsSortBy
		$sortDirection: SortDirection
		$offset: Long
		$count: Long
	) {
		domainStats(
			dataset: $dataset
			domain: $domain
			sortBy: $sortBy
			sortDirection: $sortDirection
			offset: $offset
			count: $count
		) {
			data {
				id
				domain
				score
				rating
				documents
				instanceCount
				variantCount
				duplicateCount
				instanceVariantRatio
				instanceDuplicateRatio
			}
			totalCount
		}
	}
`

const NO_DATA = Object.freeze([])

export function useDomainStats(): [DomainStats[], boolean] {
	const [dsid] = useSelectedDatasetId()
	const [{ by: sortBy, direction: sortDirection }] = useDomainAnalysisSort()
	const [domain] = useDomainQuery()
	const { loading, error, data } = useQuery(FETCH_DOMAINS, {
		variables: {
			dataset: dsid,
			domain,
			sortBy,
			sortDirection,
			offset: 0,
			count: QUERY_LIMIT,
		},
	})

	if (error) {
		console.error('error loading domain stats', error)
	}
	return [data?.domainStats?.data || NO_DATA, loading]
}

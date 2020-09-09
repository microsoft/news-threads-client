/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useQuery } from '@apollo/client'
import { Document } from '@newsthreads/schema/lib/client-types'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedDocumentIdIfNull } from '../../state'
import { argif } from '../../util/args'
import { packDocumentSort } from '../../util/packDocumentSort'
import { useSelectedDatasetId, useSelectedDatasetFeatures } from '../dataset'
import { useSearch } from '../useSearch'
import { useDocumentSort } from './useDocumentsSort'

const FETCH_DOCUMENTS = gql`
	query SearchDocuments(
		$dataset: String!
		$query: String
		$domain: String
		$offset: Long
		$count: Long
		$sortBy: DocumentSortBy
		$sortDirection: SortDirection
		$minDate: String
		$maxDate: String
		$minDomainScore: Float
		$maxDomainScore: Float
		$minInstanceVariantRatio: Float
		$maxInstanceVariantRatio: Float
		$minInstanceDuplicateRatio: Float
		$maxInstanceDuplicateRatio: Float
	) {
		documents(
			dataset: $dataset
			query: $query
			domain: $domain
			offset: $offset
			sortBy: $sortBy
			sortDirection: $sortDirection
			count: $count
			minDate: $minDate
			maxDate: $maxDate
			minDomainScore: $minDomainScore
			maxDomainScore: $maxDomainScore
			minInstanceVariantRatio: $minInstanceVariantRatio
			maxInstanceVariantRatio: $maxInstanceVariantRatio
			minInstanceDuplicateRatio: $minInstanceDuplicateRatio
			maxInstanceDuplicateRatio: $maxInstanceDuplicateRatio
		) {
			data {
				id
				docid
				title
				url
				date
				opinion
				factCheck
				domainId
				domain {
					domain
					score
					rating
				}
				stats {
					docid
					instanceCount
					variantCount
					duplicateCount
					instanceVariantRatio
					instanceDuplicateRatio
				}
				score
			}
			totalCount
		}
	}
`

const NO_DATA = Object.freeze([])

export function useDocuments(): [Document[], number, boolean] {
	const dispatch = useDispatch()
	const [dataset] = useSelectedDatasetId()
	const datasetFeatures = useSelectedDatasetFeatures()
	const [query] = useSearch<string>('query')
	const [domain] = useSearch<string>('domain')
	const [from] = useSearch<string>('from')
	const [to] = useSearch<string>('to')
	const [minDomainScore] = useSearch<number>('minDomainScore')
	const [maxDomainScore] = useSearch<number>('maxDomainScore')
	const [minInstanceVariantRatio] = useSearch<number>('minInstanceVariantRatio')
	const [maxInstanceVariantRatio] = useSearch<number>('maxInstanceVariantRatio')
	const [minInstanceDuplicateRatio] = useSearch<number>(
		'minInstanceDuplicateRatio',
	)
	const [maxInstanceDuplicateRatio] = useSearch<number>(
		'maxInstanceDuplicateRatio',
	)
	const [offset] = useSearch<number>('offset')
	const [count] = useSearch<number>('count')

	const [sort] = useDocumentSort()
	const [sortBy, sortDirection] = packDocumentSort(sort)

	const minDate = from
	const maxDate = to

	const { loading, error, data } = useQuery(FETCH_DOCUMENTS, {
		variables: {
			dataset,
			query: argif(query),
			domain: argif(domain),
			sortBy,
			sortDirection,
			offset: argif(offset, t => t >= 0),
			count: argif(count, t => t > 0),
			minDate: minDate || null,
			maxDate: maxDate || null,
			minDomainScore: argif(
				minDomainScore,
				t => !!datasetFeatures.domains && t > 0,
			),
			maxDomainScore: argif(
				maxDomainScore,
				t => !!datasetFeatures.domains && t < 100,
			),
			minInstanceVariantRatio: argif(
				minInstanceVariantRatio,
				t => !!datasetFeatures.docstats && t > 0,
			),
			maxInstanceVariantRatio: argif(
				maxInstanceVariantRatio,
				t => !!datasetFeatures.docstats && t < 1,
			),
			minInstanceDuplicateRatio: argif(
				minInstanceDuplicateRatio,
				t => !!datasetFeatures.docstats && t > 0,
			),
			maxInstanceDuplicateRatio: argif(
				maxInstanceDuplicateRatio,
				t => !!datasetFeatures.docstats && t < 1,
			),
		},
		skip: !dataset,
	})

	if (error) {
		console.error('error fetching docs', error)
	}

	// After loading a new set of documents,
	// set the selected document to the first one in the list
	// if the selected document is not explicitly already set (on page loaad)
	useEffect(
		function setSelectedDocumentId() {
			const docs = data?.documents?.data
			if (docs && docs.length) {
				dispatch(setSelectedDocumentIdIfNull(docs[0].docid))
			}
		},
		[data?.documents?.data, dispatch],
	)

	return [
		data?.documents?.data || NO_DATA,
		data?.documents?.totalCount || 0,
		loading,
	]
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import { Dataset } from '@newsthreads/schema/lib/client-types'

const FETCH_DATASETS = gql`
	{
		datasets {
			id
			label
			startDate
			endDate
			default
			features {
				dailyTermCounts
				dailyQueryCounts
				docstats
				sentenceAnalysis
				domains
			}
		}
	}
`

const NO_DATA = Object.freeze([])

/**
 * A hook to use the datasets available from the services
 */
export function useDatasets(): [Dataset[], boolean] {
	const { loading, error, data } = useQuery(FETCH_DATASETS)
	if (error) {
		console.error('error loading datasets', error)
	}

	return [data?.datasets || NO_DATA, loading]
}

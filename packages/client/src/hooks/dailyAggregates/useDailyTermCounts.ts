/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery } from '@apollo/client'
import { DailyTerm } from '../../types'
import { useSelectedDatasetId } from '../dataset'
import { FETCH_DAILY_TERM_COUNTS, processTerms } from './util'

const NO_DATA = Object.freeze([])

export function useDailyTermCounts(
	search: string,
	dateRange: [Date, Date] | undefined,
): [DailyTerm[], boolean] {
	const [dataset] = useSelectedDatasetId()
	const { loading, error, data } = useQuery(FETCH_DAILY_TERM_COUNTS, {
		variables: {
			aggregate: 'Terms',
			dataset,
			term: search,
			startDate: dateRange && dateRange[0] && dateRange[0].toISOString(),
			endDate: dateRange && dateRange[1] && dateRange[1].toISOString(),
		},
	})
	if (error) {
		console.error('error loading data', error)
	}
	const termData = processTerms(data?.dailyTermAggregate || NO_DATA)
	return [termData, loading]
}

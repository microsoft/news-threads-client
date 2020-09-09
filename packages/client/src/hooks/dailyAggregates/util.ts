/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql } from '@apollo/client'
import { DailyTermCount } from '@newsthreads/schema/lib/client-types'
import { DailyTerm } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NO_DATA: readonly any[] = Object.freeze([] as any[])

export function processTerms(items: DailyTermCount[]): DailyTerm[] {
	if (items.length === 0) {
		return NO_DATA as DailyTerm[]
	}
	const itemsWithDates = items.map(i => ({ ...i, date: new Date(i.date) }))
	return fillDays(itemsWithDates)
}

// our data storage returns no results for days with 0 count
// this just fills the array to ensure there is an entry for every day
function fillDays(dailies: DailyTerm[]): DailyTerm[] {
	if (dailies.length === 0) {
		return NO_DATA as DailyTerm[]
	}
	return dailies.reduce((acc, cur) => {
		return [...acc, cur]
	}, [] as DailyTerm[])
}

export const FETCH_DAILY_TERM_COUNTS = gql`
	query getDailyTermCounts(
		$aggregate: DailyTermAggregate!
		$dataset: String!
		$term: String!
		$startDate: String
		$endDate: String
	) {
		dailyTermAggregate(
			aggregate: $aggregate
			dataset: $dataset
			term: $term
			startDate: $startDate
			endDate: $endDate
		) {
			date
			term
			count
		}
	}
`

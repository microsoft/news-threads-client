/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db, RootQuerySelector } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import { DbDailyTerm, DateRange } from '../types'
import { applyMinMax, formatAggregateQuery } from './criteria'

export async function fetchTermDaily(
	db: Db,
	text: string,
	dateRange: DateRange,
): Promise<DbDailyTerm[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName))
		.dailyCounts
	const collection = db.collection(COLLECTION_NAME)
	const query: RootQuerySelector<any> = {
		text: formatAggregateQuery(text),
	}
	const [startDate, endDate] = dateRange
	applyMinMax(
		query,
		'date',
		startDate ? new Date(startDate) : null,
		endDate ? new Date(endDate) : null,
	)
	return (await collection
		.find(query, {
			projection: { _id: 0 },
			sort: { date: 1 },
		})
		.toArray()) as any[]
}

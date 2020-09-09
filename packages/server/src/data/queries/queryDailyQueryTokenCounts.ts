/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import { fetchQueryTokenDaily } from '../db_collections'
import { DatasetId, DbDailyTerm, DateRange } from '../types'

export async function queryDailyQueryTokenCounts(
	dataset: DatasetId,
	term: string,
	dateRange: [string, string],
): Promise<DbDailyTerm[]> {
	const client = await getClient(dataset)
	const db = client.db()
	const [startDate, endDate] = dateRange
	const dRange = [
		startDate ? new Date(startDate) : null,
		endDate ? new Date(endDate) : null,
	] as DateRange
	return fetchQueryTokenDaily(db, term, dRange)
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import moment from 'moment'
import { Collection, MongoClient } from 'mongodb'

import { insertUpdateDataset } from './insertUpdateDataset'

async function getDate(collection: Collection, order: -1 | 1): Promise<string> {
	return collection
		.findOne(
			{ date: { $ne: null } },
			{
				sort: { date: order },
			},
		)
		.then(d => moment.utc(d?.date as moment.MomentInput).format('YYYY-MM-DD'))
}

export async function insertDatasetDateRange(
	client: MongoClient,
	dataset: string,
): Promise<void> {
	const db = client.db(dataset)
	const documentsCollection = db.collection('documents')
	const [startDate, endDate] = await Promise.all([
		getDate(documentsCollection, 1),
		getDate(documentsCollection, -1),
	])
	await insertUpdateDataset(client, {
		id: dataset,
		startDate,
		endDate,
	})
}

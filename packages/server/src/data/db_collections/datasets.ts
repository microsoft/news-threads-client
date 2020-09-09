/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import { DbDataset } from '../types'

export async function fetchDatasets(db: Db): Promise<DbDataset[]> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName)).datasets
	const datasets = await db.collection(COLLECTION_NAME).find(
		{},
		{
			projection: { _id: 0 },
			sort: {
				default: -1,
			},
		},
	)
	return (await datasets.toArray()) as any[]
}

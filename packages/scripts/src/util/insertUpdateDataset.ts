/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { flatten } from 'flat'
import { Collection, MongoClient } from 'mongodb'

const DATASET_DB = 'newsdive-meta'
const DATASET_COLLECTION = 'datasets'

const defaultDataset = {
	id: '',
	label: '',
	startDate: '',
	endDate: '',
	default: false,
	features: {
		dailyQueryCounts: false,
		dailyTermCounts: false,
		docstats: false,
		domains: false,
		sentenceAnalysis: false,
	},
}

async function datasetExist(
	collection: Collection,
	dataset: string,
): Promise<boolean> {
	return collection
		.find({ id: dataset })
		.count()
		.then(c => c > 0)
}

export async function insertUpdateDataset(
	client: MongoClient,
	dataset: Record<string, any> & { id: string },
): Promise<void> {
	const db = client.db(DATASET_DB)
	const datasets = db.collection(DATASET_COLLECTION)
	const exists = await datasetExist(datasets, dataset.id)
	if (!exists) {
		const insertDataset = {
			...defaultDataset,
			...dataset,
		}
		await datasets.insert(insertDataset)
	} else {
		await datasets.findOneAndUpdate(
			{ id: dataset.id },
			{ $set: flatten(dataset) },
		)
	}
}

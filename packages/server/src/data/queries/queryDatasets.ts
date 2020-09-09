/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import { fetchDatasets } from '../db_collections/datasets'
import { DbDataset } from '../types'

/**
 * Get a list of available datasets
 */
export async function queryDatasets(): Promise<DbDataset[]> {
	const client = await getClient('newsdive-meta')
	return fetchDatasets(client.db())
}

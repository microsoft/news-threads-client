/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import DataLoader from 'dataloader'
import { DbDocument, DbDocumentStats, DbDomain, queryDomains } from './data'
import { queryDocumentsByIds, queryDocumentStatsByIds } from './data/queries'
import { packId, unpackIdList, batchIdsByDataset } from './util'

export interface AppDataSources {
	domains: DataLoader<string, DbDomain | null>
	documents: DataLoader<string, DbDocument | null>
	documentStats: DataLoader<string, DbDocumentStats | null>
}

export const createDataSources = (): AppDataSources => ({
	domains: new DataLoader<string, DbDomain | null>(ids =>
		queryDomains(ids as string[]),
	),
	documents: new DataLoader<string, DbDocument | null>(async ids => {
		const unpackedIds = unpackIdList(ids as string[])
		const reqMap = batchIdsByDataset(unpackedIds)

		// Fetch each dataset and insert the results into the dochash
		const docHash: Record<string, DbDocument> = {}
		for (const dataset of Object.keys(reqMap)) {
			const docids = reqMap[dataset]
			const documents = await queryDocumentsByIds(dataset, docids)
			for (const document of documents) {
				if (document) {
					docHash[packId(document.docid, dataset)] = document
				}
			}
		}

		return ids.map(id => docHash[id] || null)
	}),
	documentStats: new DataLoader<string, DbDocumentStats>(async docids => {
		const unpackedIds = unpackIdList(docids as string[])
		const reqMap = batchIdsByDataset(unpackedIds)

		// Fetch each dataset and insert the results into the dochash
		const itemHash: Record<string, DbDocumentStats> = {}
		for (const dataset of Object.keys(reqMap)) {
			const docids = reqMap[dataset]
			const items = await queryDocumentStatsByIds(dataset, docids)
			for (const item of items) {
				if (item) {
					itemHash[packId(item.docid, dataset)] = item
				}
			}
		}

		return docids.map(id => itemHash[id] || null)
	}),
})

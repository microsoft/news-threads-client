/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'
import { getCollectionNames } from '../dataCollections'
import { DbDomain } from '../types'

export async function fetchDomain(
	db: Db,
	domain: string,
): Promise<DbDomain | null> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName)).domains
	return db.collection(COLLECTION_NAME).findOne({ domain })
}

export async function fetchDomains(
	db: Db,
	domains: string[],
): Promise<Array<DbDomain | null>> {
	const COLLECTION_NAME = (await getCollectionNames(db.databaseName)).domains
	const result = await db
		.collection<DbDomain>(COLLECTION_NAME)
		.find({
			domain: { $in: domains },
		})
		.toArray()
	const hash: Record<string, DbDomain> = result.reduce((map, domain) => {
		map[domain.domain] = domain
		return map
	}, {} as Record<string, DbDomain>)

	return domains.map(d => hash[d] || null)
}

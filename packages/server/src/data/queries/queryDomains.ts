/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import { fetchDomains } from '../db_collections'
import { DbDomain } from '../types'

export async function queryDomains(
	domainNames: string[],
): Promise<Array<DbDomain | null>> {
	const client = await getClient('newsdive-meta')
	const db = client.db()
	return fetchDomains(db, domainNames)
}

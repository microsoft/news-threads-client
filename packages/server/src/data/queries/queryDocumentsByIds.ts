/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import { fetchDocumentsByIds } from '../db_collections'
import { DbDocument } from '../types'

export async function queryDocumentsByIds(
	dataset: string,
	ids: string[],
): Promise<Array<DbDocument | null>> {
	const client = await getClient(dataset)
	const db = client.db()
	return await fetchDocumentsByIds(db, ids)
}

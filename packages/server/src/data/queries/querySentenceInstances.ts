/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { getClient } from '../client'
import { DatasetId, SentenceId } from '../types'
import { querySentenceInstance } from './internal/querySentenceInstance'

export async function querySentenceInstances(
	dataset: DatasetId,
	sid: SentenceId,
	variantsOnly: boolean | undefined,
) {
	const client = await getClient(dataset)
	const db = client.db()
	return querySentenceInstance(db, sid, variantsOnly)
}

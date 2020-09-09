/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Unpack a global id
 * @param id The GQL id to unpack
 * @returns [dataset, item_id]
 */
export function unpackId(id: string): [string, string] {
	const [dataset, itemId] = id.split('|')
	return [dataset, itemId]
}

/**
 * Packs a dataset-local id into a global id
 * @param id
 * @param dataset
 */
export function packId(id: string | number, dataset: string) {
	return `${dataset}|${id}`
}

/**
 * Unpack a list of IDs
 * @param ids Packed IDs
 * @returns an array of [dataset, itemid]
 */
export function unpackIdList(ids: string[]): Array<[string, string]> {
	return ids.map(id => unpackId(id))
}

/**
 * Gives a set of unpacked ids in the form of [dataset, itemid], get a hash of {[dataset]: [...itemids]}
 */
export function batchIdsByDataset(
	unpackedIds: Array<[string, string]>,
): Record<string, string[]> {
	// we can only request docs from a single db at a time; so separate them by dataset
	const batches: Record<string, string[]> = {}
	unpackedIds.forEach(([dataset, docid]) => {
		if (!batches[dataset]) {
			batches[dataset] = []
		}
		batches[dataset].push(docid)
	})
	return batches
}

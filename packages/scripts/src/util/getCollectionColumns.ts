/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../config.json') as { [key: string]: any }

export function getCollectionColumns(collectionName: string): any[] {
	const collection = config[collectionName]
	return Object.keys(collection.fields).reduce<string[]>((acc, cur) => {
		return [...acc, collection.fields[cur].name]
	}, [])
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { MongoClient, Db } from 'mongodb'
import LRU = require('lru-cache')

const META_DB = 'newsdive-meta'

type DomainInfo = any

export class DomainCache {
	private db: Db
	private lru: LRU<string, DomainInfo> = new LRU({ max: 2000 })

	public constructor(client: MongoClient) {
		this.db = client.db(META_DB)
	}

	public async getDomainInfo(domain: string): Promise<DomainInfo> {
		if (this.lru.has(domain)) {
			return this.lru.get(domain)
		} else {
			const result = await this.db.collection('domains').findOne(
				{ domain },
				{
					projection: {
						_id: 0,
						uuid: 0,
						lastUpdated: 0,
						country: 0,
						language: 0,
					},
				},
			)
			this.lru.set(domain, result)
			return result
		}
	}
}

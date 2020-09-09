/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import config from 'config'
import debug from 'debug'
import { MongoClient } from 'mongodb'
import { DatasetId } from './types'

const log = debug('newsthreads:db')

const CLIENT_POOL: Record<DatasetId, MongoClient> = {}
const connectTimeoutMS = config.get<number>('database.connect_timeout')
const appname = config.get<string>('database.appname')

/**
 * Gets a MongoDB client to a target dataset
 * @param dataset The dataset to get a connection to
 */
export async function getClient(dataset: DatasetId): Promise<MongoClient> {
	if (!isConnectedToDataset(dataset)) {
		CLIENT_POOL[dataset] = await connectToDataset(dataset)
	}
	const result = CLIENT_POOL[dataset]
	result.isConnected()
	return result
}

function isConnectedToDataset(dataset: string): boolean {
	const connection = CLIENT_POOL[dataset]
	return connection?.isConnected()
}

function connectToDataset(dataset: DatasetId): Promise<MongoClient> {
	const root = config.get<string>('database.url')
	// if the root doesn't have a trailing slash, insert one
	const separator = root.endsWith('/') ? '' : '/'
	const connection = `${root}${separator}${dataset}`
	log(`connect to ${connection}`)
	return MongoClient.connect(connection, { connectTimeoutMS, appname })
}

export function dispose() {
	console.log('dispose database connections')
	Object.keys(CLIENT_POOL).forEach(client => {
		console.log(`close client `, client)
		CLIENT_POOL[client].close()
	})
}

process.on('exit', () => dispose())

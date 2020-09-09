/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { promises: fs } = require('fs')
const path = require('path')
const {
	BlobServiceClient,
	StorageSharedKeyCredential,
} = require('@azure/storage-blob')
const glob = require('glob')
const mime = require('mime-types')
var argv = require('minimist')(process.argv.slice(2))

// Load storage account and key from environment vars
const AZURE_STORAGE_ACCOUNT_ENV = 'CLIENT_DEPLOY_AZURE_CONTAINER'
const AZURE_STORAGE_ACCOUNT_KEY_ENV = 'CLIENT_DEPLOY_AZURE_CONTAINER_KEY'

// or from cli flags
const AZURE_STORAGE_ACCOUNT_ARGV = 'storage-account'
const AZURE_STORAGE_ACCOUNT_KEY_ARGV = 'storage-account-key'

// files to upload. Directory is not recreated in Azure storage.
const BUILD_PATH = 'build/'
const PUBLIC_PATH = 'public/'

/**
 * Try to load config values from cli flag or environment variable.
 * Throw error otherwise.
 */
function getCommandOption(argvKey, envKey) {
	if (argv[argvKey] && typeof argv[argvKey] === 'string') {
		return argv[argvKey]
	}

	if (process.env[envKey] && typeof process.env[envKey] === 'string') {
		return process.env[envKey]
	}

	throw new Error(
		`Invalid or missing option. Must either set environment variable ${envKey} or provide --${argvKey}.`,
	)
}

function getBlobContainerClient() {
	const account = getCommandOption(
		AZURE_STORAGE_ACCOUNT_ARGV,
		AZURE_STORAGE_ACCOUNT_ENV,
	)
	const accountKey = getCommandOption(
		AZURE_STORAGE_ACCOUNT_KEY_ARGV,
		AZURE_STORAGE_ACCOUNT_KEY_ENV,
	)

	const sharedKeyCredential = new StorageSharedKeyCredential(
		account,
		accountKey,
	)
	const blobServiceClient = new BlobServiceClient(
		`https://${account}.blob.core.windows.net`,
		sharedKeyCredential,
	)

	return blobServiceClient.getContainerClient('$web')
}

function getFiles(basePath) {
	return glob
		.sync(`${basePath}**`, { nodir: true })
		.map(f => ({ basePath, file: f.substring(basePath.length) }))
		.filter(f => f.file)
}

async function uploadFile(containerClient, fileObj) {
	const content = await fs.readFile(path.join(fileObj.basePath, fileObj.file), {
		encoding: 'utf-8',
	})
	const options = {
		blobHTTPHeaders: {
			blobContentType: mime.lookup(fileObj.file) || 'application/octet-stream',
		},
	}
	const blobClient = containerClient.getBlockBlobClient(fileObj.file)
	const uploadBlobResponse = await blobClient.upload(
		content,
		Buffer.byteLength(content),
		options,
	)
	console.log(
		`Upload ${fileObj.file} successfully`,
		uploadBlobResponse.requestId,
	)
}

async function main() {
	const containerClient = getBlobContainerClient()
	const files = [...getFiles(BUILD_PATH), ...getFiles(PUBLIC_PATH)]
	for (const fileObj of files) {
		await uploadFile(containerClient, fileObj)
	}
}

main().catch(err => {
	throw err
})

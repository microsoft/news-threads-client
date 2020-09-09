/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { MongoClient, Collection } from 'mongodb'
import { trimDomain } from '../../util/domains'
import { DomainCache } from './DomainCache'

const DOCUMENTS = 'documents'
const SEARCH_PRECOMPUTE = 'docsearch'
const BATCH_SIZE = 2000

export interface BuildSearchIndexCommandOptions {
	dbUrl: string
	verbose: boolean
}

export async function execute(
	dataset: string,
	{ dbUrl }: BuildSearchIndexCommandOptions,
): Promise<number> {
	const client = await createClient(dbUrl)
	const domainCache = new DomainCache(client)
	const db = client.db(dataset)
	const documents = db.collection(DOCUMENTS)
	const searchTable = db.collection(SEARCH_PRECOMPUTE)

	let skip = 0
	let isFinished = false

	while (!isFinished) {
		const documentBatch = await documents
			.find({})
			.skip(skip)
			.limit(BATCH_SIZE)
			.toArray()
		await handleDocuments(documentBatch, domainCache, searchTable)

		process.stdout.write('.')
		if (documentBatch.length < BATCH_SIZE) {
			isFinished = true
		} else {
			skip += BATCH_SIZE
		}
	}

	await searchTable.createIndex(
		{ title: 'text' },
		{ name: 'documentTextFacetIndex' },
	)
	process.stdout.write('o')
	await searchTable.createIndex({ date: -1 }, { name: 'dateFacetIndex' })
	process.stdout.write('o')
	await searchTable.createIndex(
		{ domainRating: 1 },
		{ name: 'domainRatingFacetIndex' },
	)
	process.stdout.write('o')
	await searchTable.createIndex({ date: 1 }, { name: 'domainScoreFacetIndex' })
	process.stdout.write('o')
	await searchTable.createIndex(
		{ domain: 'hashed' },
		{ name: 'domainNameFacetIndex' },
	)
	process.stdout.write('o')
	return 0
}

function createClient(dbUrl: string): Promise<MongoClient> {
	return MongoClient.connect(dbUrl, {
		appname: 'NewsThreads Scripts',
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
}

async function handleDocuments(
	docBatch: any[],
	domainCache: DomainCache,
	outputTable: Collection,
): Promise<void> {
	const mongodocs: any[] = []
	for (const document of docBatch) {
		const domain = trimDomain(document.domain)
		const domainInfo = (await domainCache.getDomainInfo(domain)) || {}
		mongodocs.push({
			...document,
			domain,
			domainRating: domainInfo.rating,
			domainScore: domainInfo.score,
			domainDoesNotRepeatedlyPublishFalseContent:
				domainInfo.doesNotRepeatedlyPublishFalseContent,
			domainPresentsInformationResponsibly:
				domainInfo.presentsInformationResponsibly,
			domainRegularlyCorrectsErrors: domainInfo.regularlyCorrectsErrors,
			domainHandlesNewsVsOpinion: domainInfo.handlesNewsVsOpinion,
			domainAvoidsDeceptiveHeadlines: domainInfo.avoidsDeceptiveHeadlines,
			domainDisclosesOwnership: domainInfo.disclosesOwnership,
			domainClearlyLabelsAdvertising: domainInfo.clearlyLabelsAdvertising,
			domainRevealsWhoIsInCharge: domainInfo.revealsWhoIsInCharge,
			domainProvidesAuthorNames: domainInfo.providesAuthorNames,
		})
	}
	await outputTable.insertMany(mongodocs, { ordered: false })
}

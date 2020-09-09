/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DateString } from './util'

/**
 * These are feature flags specific to a dataset.
 * The main reason for assigning these differentially would
 * be the availability of data layers that don't exist for all
 * datasets.
 */
export interface DbDatasetFeatureFlags {
	/**
	 * Indicates that an index of daily articles containing a search term is available.
	 */
	dailyTermCounts?: boolean
	/**
	 * Indicates that an index of daily user queries containing a search term is available.
	 */
	dailyQueryCounts?: boolean
	/**
	 * Indicates that docstats have been precomputed and normalized. Indicates that
	 * PRECOMPUTE_docsearch and PRECOMPUTE_docstats are available.
	 */
	docstats?: boolean
}

export interface DbDataset {
	id: string
	label: string
	/**
	 * Start and end date of news the query covers, as ISO dates
	 * Note that we sometimes have spurious documents outside these bounds,
	 * due to the date extraction routines. This helps establish hard bounds when desired.
	 */
	startDate: string
	endDate: string
	/**
	 * Indicates that this dataset should be the default shown to the user.
	 */
	default?: boolean
	features?: DbDatasetFeatureFlags
}

/**
 * A dataset identifier
 */
export type DatasetId = string

/**
 * A document identifier
 */
export type DocumentId = string

/**
 * A sentence identifier
 */
export type SentenceId = number

/**
 * A cluster identifier
 */
export type ClusterId = number

/**
 * A fragment summary object. This is the type on the `fragment_summaries` / `fragment_summaries_lsh` collection
 */
export interface DbSentence {
	/**
	 * The sentence id of interest
	 */
	sid: SentenceId

	/**
	 * The document of interest
	 */
	docid: DocumentId

	/**
	 * The index of the sentence in the document
	 */
	sindex: number

	/**
	 * The cluster this sentence belongs to
	 */
	clusterId: ClusterId

	/**
	 * The sentence this sentence is derived from
	 */
	sourceId: SentenceId

	/**
	 * The sentence text
	 */
	text: string
}

export interface DbSentenceText {
	sid: SentenceId
	text?: string
}

export interface DbDomain {
	domain: string
	parentDomain: string
	rating: DbDomainRating
	lastUpdated: Date
	language: string
	country: string

	/**
	 * A rating from 0-100
	 */
	score: number

	doesNotRepeatedlyPublishFalseContent: boolean
	presentsInformationResponsibly: boolean
	regularlyCorrectsErrors: boolean
	handlesNewsVsOpinion: boolean
	avoidsDeceptiveHeadlines: boolean
	disclosesOwnership: boolean
	clearlyLabelsAdvertising: boolean
	revealsWhoIsInCharge: boolean
	providesAuthorNames: boolean
}

export enum DbDomainRating {
	Trustworthy = 'T',
	NotTrustworthy = 'N',
	Parody = 'P',
	InProgress = 'TK',
}

/**
 * Represents a rollup of domain data for a dataset.
 * This does basic reducing on the document stats, by domain,
 * as well as including some top-level rating data for search/sort.
 */
export interface DbDomainStats {
	domain: string
	rating: DbDomainRating
	score: number
	documents: number
	instanceCount: number
	duplicateCount: number
	variantCount: number
	instanceVariantRatio: number
	instanceDuplicateRatio: number
}

export interface DbDocument {
	/**
	 * The Document id
	 */
	docid: DocumentId

	/**
	 * The title of the document
	 */
	title: string

	/**
	 * The URL of the document
	 */
	url: string

	/**
	 * The domain the document was published on
	 */
	domain: string

	/**
	 * The publication date of the document
	 */
	date: DateString

	/**
	 * A flag indicating whether this document is an opinion piece
	 */
	opinion: boolean

	/**
	 * A flag indicating whether this document is a fact-checking piece
	 */
	factCheck: boolean
}

export interface DbDocumentStats {
	/**
	 * The Document id
	 */
	docid: DocumentId
	instanceCount: number
	variantCount: number
	duplicateCount: number
	instanceVariantRatio: number
	instanceDuplicateRatio: number
}

/**
 * A generic score item
 */
export type Scored<T> = T & {
	/**
	 * The relevance score of this instance
	 */
	score: number
}

/**
 * An augmentented sentence info object
 */
export interface DbSentenceWithStats extends DbSentence {
	/**
	 * The text of the upstream sentence
	 */
	sourceText: string

	/**
	 * The number of instances of this sentence in the cluster
	 */
	instanceCount: number

	/**
	 * The number of variants of this sentences in the clusters
	 */
	variantCount: number

	/**
	 * The number of duplicates this sentence has
	 */
	duplicateCount: number
}

/**
 * Information about a document's strength to a cluster
 */
export interface DbCluster {
	/**
	 * The document id
	 */
	docid: DocumentId

	/**
	 * The cluster id
	 */
	clusterId: ClusterId

	/**
	 * The cluster level
	 */
	epsilon: number

	/**
	 * The number of documents at this clusterid/epsilon level
	 */
	documentCount?: number
}

export interface DbSentenceCluster {
	/**
	 * The cluster id
	 */
	clusterId: ClusterId

	/**
	 * The sentence id
	 */
	sourceId: SentenceId

	instanceCount: number
	duplicateCount: number
	variantCount: number
	instanceVariantRatio: number
	instanceDuplicateRatio: number
	sourceSentenceText?: string
}

export interface DbDailyTerm {
	text: string
	/**
	 * Date string at day resolution (e.g., 2020_03_01)
	 */
	date: string
	count: number
}

export type DateRange = [Date | null, Date | null]

export interface DbSearchDocument extends DbDocument {
	domainRating: string | null
	domainScore: number | null
	domainDoesNotRepeatedlyPublishFalseContent: boolean | null
	domainPresentsInformationResponsibly: boolean | null
	domainRegularlyCorrectsErrors: boolean | null
	domainHandlesNewsVsOpinion: boolean | null
	domainAvoidsDeceptiveHeadlines: boolean | null
	domainDisclosesOwnership: boolean | null
	domainClearlyLabelsAdvertising: boolean | null
	domainRevealsWhoIsInCharge: boolean | null
	domainProvidesAuthorNames: boolean | null
	instanceVariantRatio: number | null
	instanceDuplicateRatio: number | null
}

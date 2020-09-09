/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Document,
	Domain,
	DocumentStats,
} from '@newsthreads/schema/lib/provider-types'
import { DbDocument, Scored } from '../data'
import { packId } from '../util'
import { encodeDate, trimDomain } from './util'

export function createGQLDocument(
	document: Partial<Scored<DbDocument>>,
	dataset: string,
): Document {
	return {
		...document,
		__typename: 'Document',
		id: packId(document.docid!, dataset),
		date: encodeDate(document.date),
		domainId: trimDomain(document.domain),
		domain: {
			domain: trimDomain(document.domain),
			rating: 'Unknown',
			__typename: 'Domain',
		} as Domain,
		stats: {
			__typename: 'DocumentStats',
			docid: '',
			instanceCount: 0,
			variantCount: 0,
			duplicateCount: 0,
			instanceVariantRatio: 0,
			instanceDuplicateRatio: 0,
		} as DocumentStats,
		clusters: [],
		sentences: [],
	} as Document
}

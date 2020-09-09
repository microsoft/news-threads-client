/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Document,
	DocumentsResultPage,
} from '@newsthreads/schema/lib/provider-types'
import { DbDocument, Scored } from '../data'
import { createGQLDocument } from './createGQLDocument'

export function createGQLDocumentsResultPage(
	documents: Partial<Scored<DbDocument>>[],
	dataset: string,
	offset: number | null | undefined,
	totalCount: number,
): DocumentsResultPage {
	if (offset == null) {
		offset = 0
	}
	return {
		data: documents
			.filter(d => !!d)
			.map(doc => createGQLDocument(doc, dataset)) as Document[],
		totalCount,
		offset,
		hasNextPage: offset + documents.length < totalCount,
		__typename: 'DocumentsResultPage',
	}
}

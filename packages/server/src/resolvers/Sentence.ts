/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	SentenceResolvers,
	Document,
} from '@newsthreads/schema/lib/provider-types'
import { createGQLDocument } from '../factories'
import { unpackId } from '../util'
import { ServerGqlContext } from './types'

export const Sentence: SentenceResolvers = {
	/**
	 * Resolve the document on a sentence
	 */
	async document(parent, _args, { dataSources }: ServerGqlContext) {
		const document = await dataSources.documents.load(parent.document.id)
		if (document == null) {
			throw new Error('could not find document' + parent.document.id)
		}
		const [dataset] = unpackId(parent.document.id)
		return createGQLDocument(document, dataset) as Document
	},
}

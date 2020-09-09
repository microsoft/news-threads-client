/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useQuery } from '@apollo/client'
import { Document } from '@newsthreads/schema/lib/client-types'
import { useSelectedDatasetId } from '../dataset'

const FETCH_DOCUMENT_WITH_SENTENCES = gql`
	query getDocumentWithSentences($id: String!) {
		document(id: $id) {
			id
			docid
			title
			url
			date
			opinion
			factCheck
			domain {
				domain
				score
				rating
			}
			sentences {
				id
				sid
				cid
				document {
					docid
					date
					domain {
						domain
					}
				}
				sindex
				sourceId
				text
				instanceCount
				variantCount
				duplicateCount
			}
		}
	}
`

export function useDocument(docid: string | null): [Document | null, boolean] {
	const [dsid] = useSelectedDatasetId()
	const id = `${dsid}|${docid}`
	const { loading, error, data } = useQuery(FETCH_DOCUMENT_WITH_SENTENCES, {
		variables: {
			id,
		},
		skip: docid == null || dsid == null,
	})

	if (error) {
		console.error('caught error', error)
	}
	return [data?.document, loading]
}

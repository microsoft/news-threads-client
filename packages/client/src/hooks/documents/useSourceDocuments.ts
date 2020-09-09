/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useQuery } from '@apollo/client'
import { Document } from '@newsthreads/schema/lib/client-types'
import { useSelectedDatasetId } from '../dataset'

const FETCH_SOURCE_DOCUMENTS = gql`
	query SearchDocuments($id: String!) {
		sourceDocuments(id: $id) {
			id
			docid
			date
		}
	}
`

const NO_DATA = Object.freeze([])

export function useSourceDocuments(docid: string): [Document[], boolean] {
	const [dataset] = useSelectedDatasetId()
	const { loading, error, data } = useQuery(FETCH_SOURCE_DOCUMENTS, {
		variables: {
			id: `${dataset}|${docid}`,
		},
		skip: !dataset || !docid,
	})

	if (error) {
		console.error('error fetching docs', error)
	}
	return [data?.sourceDocuments || NO_DATA, loading]
}

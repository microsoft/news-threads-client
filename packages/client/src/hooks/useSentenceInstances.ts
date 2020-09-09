/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useQuery } from '@apollo/client'
import { Sentence } from '@newsthreads/schema/lib/client-types'
import { useSelectedDatasetId } from './dataset'

const FETCH_SENTENCE_INSTANCES = gql`
	query getSentenceInstances(
		$dataset: String!
		$sid: Long!
		$variantsOnly: Boolean
	) {
		sentenceInstances(
			dataset: $dataset
			sid: $sid
			variantsOnly: $variantsOnly
		) {
			id
			sid
			document {
				docid
				date
				title
				domain {
					domain
					rating
					score
				}
			}
			sindex
			cid
			text
		}
	}
`

export function useSentenceInstances(
	sid: number,
	skip = false,
	variantsOnly = false,
): [Sentence[], boolean] {
	const [dataset] = useSelectedDatasetId()
	const { loading, error, data } = useQuery(FETCH_SENTENCE_INSTANCES, {
		variables: {
			sid,
			dataset,
			variantsOnly,
		},
		skip,
	})

	if (error) {
		console.error('error loading sentence instances', error)
	}

	return [data?.sentenceInstances || NO_DATA, loading]
}

const NO_DATA = []

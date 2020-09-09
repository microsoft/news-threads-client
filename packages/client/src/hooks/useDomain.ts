/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { gql, useQuery } from '@apollo/client'
import { Domain } from '@newsthreads/schema/lib/client-types'

const FETCH_DOMAIN = gql`
	query fetchDomain($id: String!) {
		domain(id: $id) {
			id
			rating
			score
		}
	}
`
export function useDomain(domain: string | null): [Domain | null, boolean] {
	const { loading, error, data } = useQuery(FETCH_DOMAIN, {
		variables: {
			id: domain,
		},
		skip: domain == null,
	})

	if (error) {
		console.error('error fetching domain', error)
	}
	return [data?.domain || null, loading]
}

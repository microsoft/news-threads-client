/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	ApolloLink,
} from '@apollo/client'
import { BatchHttpLink } from '@apollo/link-batch-http'
import { setContext } from '@apollo/link-context'
import { getAccessToken } from '@essex/msal-interactor'
import { msalInstance } from './msalInstance'

const setAuthorizationLink = setContext(async (req, prevContext) => {
	if (CONFIG.auth.disabled) {
		return {}
	} else {
		const accounts = msalInstance.getAllAccounts()
		if (accounts.length) {
			const accessToken = await getAccessToken(
				msalInstance,
				accounts[0],
				CONFIG.auth.apiScopes.split(','),
			)
			return {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		} else {
			return {}
		}
	}
})

export const gqlClient = new ApolloClient({
	connectToDevTools: CONFIG.feature.apolloDevTools,
	cache: new InMemoryCache(),
	link: setAuthorizationLink.concat(createHttpLink()) as ApolloLink,
})

function createHttpLink(): ApolloLink {
	const uri = CONFIG.api.url.graphqlApi
	const isBatching = CONFIG.feature.apolloClientBatching
	return isBatching ? new BatchHttpLink({ uri }) : new HttpLink({ uri })
}

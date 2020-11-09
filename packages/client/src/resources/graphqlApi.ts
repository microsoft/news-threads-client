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
import { msalInteractorInstance } from './msalInteractorInstance'

const setAuthorizationLink = setContext(async (req, prevContext) => {
	if (CONFIG.auth.disabled) {
		return {}
	} else {
		const accessToken = await msalInteractorInstance.getAccessToken([
			'https://newsdive-api.azurewebsites.net/.default',
		])
		return {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
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

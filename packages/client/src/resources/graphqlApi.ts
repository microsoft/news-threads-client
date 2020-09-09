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
import { store } from '../state'

const setAuthorizationLink = setContext(async (req, prevContext) => {
	const state = store.getState()
	if (!state.auth.jwtIdToken) {
		return {}
	} else {
		return {
			headers: {
				Authorization: state.auth.jwtIdToken,
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

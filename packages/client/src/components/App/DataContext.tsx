/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloProvider } from '@apollo/client'
import React, { useEffect, memo } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { gqlClient } from '../../resources/graphqlApi'
import { store, loadData } from '../../state'

export const DataContext: React.FC = memo(function DataContext({ children }) {
	useInitialDataBlast()
	return (
		<ApolloProvider client={gqlClient}>
			<ReduxProvider store={store}>{children}</ReduxProvider>
		</ApolloProvider>
	)
})

function useInitialDataBlast(): void {
	useEffect(() => {
		store.dispatch(loadData())
	}, [])
}

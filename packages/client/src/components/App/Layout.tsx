/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import React, { Suspense, memo } from 'react'
import styled from 'styled-components'
import { useIsLoaded } from '../../hooks'
import { AppHeader } from '../AppHeader'

export const Layout: React.FC = memo(function Layout({ children }) {
	const isDataLoaded = useIsLoaded()
	if (!isDataLoaded) {
		return null
	}
	return (
		<Container>
			<AppHeader />
			<Suspense fallback={<StyledSpinner />}>
				<Content>{children}</Content>
			</Suspense>
		</Container>
	)
})

const StyledSpinner = styled(Spinner)`
	margin-top: 20px;
`

const Container = styled.div`
	margin: 0;
	height: 100vh;
	display: flex;
	flex-flow: column;
`

const Content = styled.div`
	margin: 0 20px 20px 20px;
	flex: 1;
	display: flex;
	flex-flow: column;
	overflow-y: hidden;
`

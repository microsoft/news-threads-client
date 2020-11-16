/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MsalProvider } from '@azure/msal-react'
import React, { memo } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { msalInstance } from '../../resources/msalInstance'
import { AuthProtect } from './AuthProtect'
import { DataContext } from './DataContext'
import { Layout } from './Layout'
import { Routes } from './Routes'
import { StyleContext } from './StyleContext'

export const App: React.FC = memo(function App() {
	return (
		<MsalProvider instance={msalInstance}>
			<AuthProtect>
				<DataContext>
					<Router>
						<StyleContext>
							<Layout>
								<Routes />
							</Layout>
						</StyleContext>
					</Router>
				</DataContext>
			</AuthProtect>
		</MsalProvider>
	)
})

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThematicFluentProvider } from '@thematic/fluent'
import { ApplicationStyles } from '@thematic/react'
import React, { memo } from 'react'
import { createGlobalStyle } from 'styled-components'
import { useTheme } from '../../hooks'

export const StyleContext: React.FC = memo(function StyleContext({ children }) {
	const theme = useTheme()
	return (
		<>
			<GlobalStyle />
			<ThematicFluentProvider theme={theme}>
				<ApplicationStyles />
				{children}
			</ThematicFluentProvider>
		</>
	)
})

const GlobalStyle = createGlobalStyle`
	body {
		height: 100vh;
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
			'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
			sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
			monospace;
	}
`

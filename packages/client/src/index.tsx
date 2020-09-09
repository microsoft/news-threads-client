/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'regenerator-runtime'
import { enableMapSet } from 'immer'
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/App'

enableMapSet()

export function mount(): void {
	try {
		if (CONFIG.feature.renderTracking) {
			enableRenderTracking()
		}
		renderApp()
	} catch (err) {
		console.error('bootstrapping caught error', err)
	}
}

function enableRenderTracking(): void {
	if (CONFIG.feature.renderTracking) {
		/* eslint-disable-next-line @typescript-eslint/no-var-requires */
		const whyDidYouRender = require('@welldone-software/why-did-you-render')
		whyDidYouRender(React, {
			trackAllPureComponents: true,
			trackHooks: true,
			exclude: [new RegExp('Visible')],
		})
	}
}

function renderApp(): void {
	const root = document.createElement('div')
	document.body.appendChild(root)
	ReactDOM.render(<App />, root)
}

mount()

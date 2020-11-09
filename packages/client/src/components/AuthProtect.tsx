/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useState, useEffect } from 'react'
import { msalInteractorInstance } from '../resources/msalInteractorInstance'

export const AuthProtect: React.FC = memo(function AuthProtect({ children }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	useEffect(() => {
		async function authenticate() {
			if (CONFIG.auth.disabled) {
				setIsAuthenticated(false)
			} else {
				const isAuthenticated = await msalInteractorInstance.isAuthenticated()
				if (!isAuthenticated) {
					const authResult = await msalInteractorInstance.login({
						usePopup: true,
					})
					if (authResult) {
						setIsAuthenticated(true)
					}
				} else {
					setIsAuthenticated(isAuthenticated)
				}
			}
		}
		authenticate()
	}, [])

	if (!isAuthenticated) {
		return <>Loading...</>
	} else {
		return <>{children}</>
	}
})

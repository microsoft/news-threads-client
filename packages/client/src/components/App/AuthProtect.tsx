/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import React, { memo, useState, useEffect } from 'react'

export const AuthProtect: React.FC = memo(function AuthProtect({ children }) {
	const msal = useMsal()
	const isAuthenticated = useIsAuthenticated()
	useEffect(() => {
		async function authenticate() {
			if (!isAuthenticated) {
				await msal.instance.loginPopup({
					scopes: CONFIG.auth.scopes.split(','),
				})
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

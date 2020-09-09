/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'
import { AzureAD, MsalAuthProvider } from 'react-aad-msal'
import { useSelector } from 'react-redux'
import { createAuthProvider } from '../resources/authProvider'
import { store, AppState } from '../state'

export interface AuthProtectProps {
	/**
	 * If true, will not _force_ a login, just encourage one
	 */
	soft?: boolean
}

export const AuthProtect: React.FC<AuthProtectProps> = memo(
	function AuthProtect({ children, soft }) {
		const account = useSelector((state: AppState) => state.auth.account)
		const showChildren = useMemo(() => !!account || soft, [account, soft])

		if (CONFIG.auth.disabled) {
			return <>{children}</>
		} else {
			return (
				<ActuallyAuthProtect soft={soft}>
					{showChildren ? children : null}
				</ActuallyAuthProtect>
			)
		}
	},
)

const ActuallyAuthProtect: React.FC<AuthProtectProps> = memo(
	function ActuallyAuthProtect({ soft, children }) {
		const authProvider = useMemo(() => createAuthProvider(), [])
		return (
			<AzureAD provider={authProvider} forceLogin={!soft} reduxStore={store}>
				{children}
			</AzureAD>
		)
	},
)

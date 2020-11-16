/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PublicClientApplication } from '@azure/msal-browser'

export const msalInstance = new PublicClientApplication({
	auth: {
		clientId: CONFIG.auth.client_id,
		authority: CONFIG.auth.authority,
	},
	cache: {
		cacheLocation: 'localStorage',
		storeAuthStateInCookie: false,
	},
})

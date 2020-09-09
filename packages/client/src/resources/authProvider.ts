/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'
import { LogLevel, Logger } from 'msal'
import { AuthOptions } from 'msal/lib-commonjs/Configuration'
import { MsalAuthProvider, LoginType } from 'react-aad-msal'

const log = debug('newsthreads:auth')

const authScopes = CONFIG.auth.scopes.split('|')
const authAuthority = CONFIG.auth.authority
const authClientId = CONFIG.auth.client_id
const authRedirectUri = CONFIG.auth.redirect_uri || window.location.origin
const authUseLogger = CONFIG.auth.use_logger

const createAuthLogger = (): Logger =>
	new Logger((_logLevel, message, _containsPii) => log('[MSAL]', message), {
		level: LogLevel.Verbose,
		piiLoggingEnabled: false,
	})

// Msal Configurations
const auth: AuthOptions = {
	authority: authAuthority,
	clientId: authClientId,
	redirectUri: authRedirectUri,
	validateAuthority: true,
	// After being redirected to the "redirectUri" page, should user
	// be redirected back to the Url where their login originated from?
	navigateToLoginRequestUrl: false,
}

export function createAuthProvider(): MsalAuthProvider {
	return new MsalAuthProvider(
		{
			auth,
			system: {
				logger: authUseLogger ? createAuthLogger() : undefined,
			},
			cache: {
				storeAuthStateInCookie: true,
			},
		},
		{ scopes: authScopes },
		{
			loginType: LoginType.Popup,
			// When a token is refreshed it will be done by loading a page in an iframe.
			// Rather than reloading the same page, we can point to an empty html file which will prevent
			// site resources from being loaded twice.
			tokenRefreshUri: window.location.origin + '/auth.html',
		},
	)
}

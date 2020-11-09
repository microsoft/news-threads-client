import { MsalInteractor } from '@essex/msal-interactor'

export const msalInteractorInstance = new MsalInteractor({
	msalConfig: {
		auth: {
			clientId: CONFIG.auth.client_id,
			authority: CONFIG.auth.authority,
			redirectUri: CONFIG.auth.redirect_uri,
		},
		cache: {
			cacheLocation: 'localStorage',
			storeAuthStateInCookie: false,
		},
	},
	oidcScopes: CONFIG.auth.scopes.split(','),
})

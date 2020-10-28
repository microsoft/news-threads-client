/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import config from 'config'
import debug from 'debug'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const log = debug('newsthreads:gql')

/**
 * Get the signing public-key of the Identity Provider service
 */
function getSigningKeyPromise(kid: string, client): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			client.getSigningKey(kid, (err, key) => {
				try {
					if (err) {
						reject(err)
					}
					const signingKey = key.publicKey || key.rsaPublicKey
					resolve(signingKey)
				} catch (err) {
					reject(err)
				}
			})
		} catch (err) {
			reject(err)
		}
	})
}

// this function will actually check the JWT token to see if it's valid,
export async function decodeToken(accessToken: string): Promise<any> {
	log('Unparsed accessToken: %s', accessToken)
	const parsed = jwt.decode(accessToken, { complete: true }) as Record<
		string,
		any
	>
	const kid = parsed?.header?.kid

	// Load the appropriate public key from the AAD Tenant.
	const client = jwksClient({
		strictSsl: true, // Default value
		jwksUri: `https://${config.get<string>('auth.authority')}/${config.get<
			string
		>('auth.tenantId')}/${config.get<string>('auth.keyDiscovery')}`,
	})
	const signingKey = await getSigningKeyPromise(kid, client)

	// Use the public key to verify the token signature
	// Also validate the token issuer is from the expected authority
	// And that the audience of the token is this current API
	const decodedAndVerified = jwt.verify(accessToken, signingKey, {
		issuer: `https://${config.get<string>('auth.authority')}/${config.get<
			string
		>('auth.tenantId')}/${config.get<string>('auth.version')}`,
		audience: config.get<string>('auth.clientId'),
	})

	log('Parsed, verified and validated token: %O', decodedAndVerified)

	if (!decodedAndVerified) {
		throw Error('verification returned null')
	}

	//if everything has gone to plan, our JWT is valid and we can safely return the decoded version.
	return decodedAndVerified
}

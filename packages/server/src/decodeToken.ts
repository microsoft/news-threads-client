/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import config from 'config'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

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

//this function will actually check the JWT idToken to see if it's valid,
export async function decodeToken(idToken: string | undefined): Promise<any> {
	if (!idToken) {
		return null
	}
	const parsed = jwt.decode(idToken, { complete: true }) as Record<string, any>
	const kid = parsed?.header?.kid

	//the signing key will be stored in a Json Web Key Set (basically just a list of signing keys, this will point our client at Microsot's key set)
	const client = jwksClient({
		strictSsl: true, // Default value
		jwksUri: config.get<string>('auth.jwksUri'),
		requestHeaders: {}, // Optional
	})

	// this will reach out and try to get the signing key from the key set based on the unique id
	const signingKey = await getSigningKeyPromise(kid, client)

	//once found it will verify the token with that signing k`ey
	const decodedAndVerified = jwt.verify(idToken, signingKey)
	if (!decodedAndVerified) {
		throw Error('verification returned null')
	}

	//if everything passes this is where you should verify that it was issued by the expected tenant id / client id / application by checking the claims and comparing them to your Azure AD App Registration. At this point it's still possible that the token was created by a different Azure AD tenant, we've technically just verified that it was signed by microsoft and everything inside is true, we don't yet know that it was issued by our authentication application specifically. But there will be a claim inside the token that indicates the ids of the tenant / app registration that we can double check.

	//if everything has gone to plan, our JWT is valid and we can safely return the decoded version.
	return decodedAndVerified
}

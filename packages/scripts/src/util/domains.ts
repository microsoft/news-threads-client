/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Trims leading text off a domain to normalize.
 * TODO: should we be more aggressive about removing subdomains?
 * @param url
 */
export function trimDomain(url: string | undefined) {
	return (url || '').replace(/www\./, '')
}

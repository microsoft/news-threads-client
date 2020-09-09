/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as queryString from 'query-string'

export function parseQuery(): queryString.ParsedQuery<string> {
	const s = window.location.search || ''
	const query = queryString.parse(s)
	return query
}

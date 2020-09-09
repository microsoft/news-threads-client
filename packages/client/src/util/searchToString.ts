/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SearchState } from '../state'

/**
 * TODO: return tokenized search string
 * Once parsing of tokens is supported (parseSearchString.ts)
 */
export function searchToString(search: SearchState): string {
	// return `${search.query} ${search.domain && 'site:' + search.domain}`.trim()
	return `${search.query}`
}

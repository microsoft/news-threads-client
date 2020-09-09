/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SearchState } from '../state'

/**
 * TODO: Replace with power-search tokenizer/parser
 */
export function parseSearchString(search: string): SearchState {
	const [query, domain = ''] = search.split('site:').map(v => v.trim())
	return {
		query,
		domain,
		from: '',
		to: '',
		minDomainScore: 0,
		maxDomainScore: 100,
		minInstanceVariantRatio: 0,
		maxInstanceVariantRatio: 100,
		minInstanceDuplicateRatio: 0,
		maxInstanceDuplicateRatio: 100,
		offset: 0,
		count: CONFIG.search.count,
	}
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FilterQuery } from 'mongodb'

/**
 * Our query and term aggregation tables support multi-word
 * queries by extracting n-grams (currently n = 1 or 2).
 * To reduce the size and collapse the "same" query,
 * we sort the grams alphabetically and store as a string.
 * E.g., 'bill gates' and 'gates bill' will both resolve to 'bill gates'.
 * NOTE: this does not attempt to limit to the current n-gram setting
 * of 2. So a trigram will end up having no matches.
 * @param text
 */
export function formatAggregateQuery(text: string) {
	return text.split(' ').sort().join(' ')
}

export function applyMinMax<T>(
	criteria: FilterQuery<T>,
	field: keyof T,
	min: any | null | undefined,
	max: any | null | undefined,
) {
	if (isValidArgument(min) || isValidArgument(max)) {
		;(criteria as any)[field] = {}
		if (min != null) {
			criteria[field].$gte = min
		}
		if (max != null) {
			criteria[field].$lte = max
		}
	}
}

export function applyTextFieldFilter<T>(
	criteria: FilterQuery<T>,
	field: keyof T,
	query: string | RegExp | null | undefined,
) {
	if (isValidArgument(query)) {
		;(criteria as any)[field] =
			typeof query === 'string' ? query : { $regex: query }
	}
}

function isValidArgument(value: any): boolean {
	return value != null && value !== ''
}

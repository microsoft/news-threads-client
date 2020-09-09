/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function encodeDate(
	date: Date | string | null | undefined,
): string | null {
	if (date == null) {
		return null
	} else if (typeof date === 'string') {
		return date
	} else {
		return date.toISOString()
	}
}

export function trimDomain(url: string | undefined) {
	return (url || '').replace(/www\./, '')
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Some of the scraped data has bad encoding, this replaces a few obvious and common ones.
 * @param text
 */
export function encoding(text: string): string {
	return text
		.replace(/â€™/g, `'`)
		.replace(/â€œ/g, `"`) // this is actually a left quote
		.replace(/â€/g, `"`) // right quote
}

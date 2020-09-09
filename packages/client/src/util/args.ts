/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Includes an argument if it passes a check
 * @param input The query argument
 * @param predicate The predicate for including an argument; default=truthy check
 */
export function argif<T>(
	input: T,
	predicate: (input: T) => boolean = t => !!t,
): T | null {
	return predicate(input) ? input : null
}

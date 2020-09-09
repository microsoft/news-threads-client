/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function union<T>(set1: Set<T>, set2: Set<T>): Set<T> {
	return new Set([...set1, ...set2])
}

export function intersect<T>(set1: Set<T>, set2: Set<T>): Set<T> {
	return new Set([...set1].filter(a => set2.has(a)))
}

export function complement<T>(set1: Set<T>, set2: Set<T>): Set<T> {
	const leftSet = new Set([...set1].filter(a => !set2.has(a)))
	const rightSet = new Set([...set2].filter(a => !set1.has(a)))
	return new Set([...leftSet, ...rightSet])
}

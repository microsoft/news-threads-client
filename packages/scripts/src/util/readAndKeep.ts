/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as fs from 'fs'
import { createStream as byline } from 'byline'

const identity = <T>(line: T) => line
const defaultPredicate = () => true

/**
 * reads a csv file by line and keeps those that match a specified predicate
 * note it assumes headers in csv for first line!
 */
export async function readAndKeep(
	filename: string,
	transformer?: null | undefined | ((input: any) => any),
	predicate?: null | undefined | ((row: any) => boolean),
	noHeaders?: boolean,
): Promise<string[]> {
	const xform = transformer || identity
	const pred = predicate || defaultPredicate
	return new Promise((resolve, reject) => {
		const items: string[] = []
		let first = true
		const stream = byline(fs.createReadStream(filename, 'utf8'))
		stream.on('data', (line: any) => {
			if (noHeaders || !first) {
				const obj = xform(line)
				if (pred(obj)) {
					items.push(obj)
				}
			}
			first = false
		})
		stream.on('end', () => resolve(items))
	})
}

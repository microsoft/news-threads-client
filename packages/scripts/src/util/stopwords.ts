/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as fs from 'fs'
import { join } from 'path'
import * as readline from 'readline'

export async function list(): Promise<string[]> {
	console.log(__dirname)
	const file = join(__dirname, '../../static/stopwords.txt')
	const input = fs.createReadStream(file)
	const reader = readline.createInterface({
		input: input,
		crlfDelay: Infinity,
	})
	const words = []
	for await (const line of reader) {
		words.push(line)
	}
	return words
}

export async function set(): Promise<Set<string>> {
	const l = await list()
	const s = new Set<string>()
	l.forEach(w => s.add(w))
	return s
}

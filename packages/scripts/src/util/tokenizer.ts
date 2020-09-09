/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { set } from './stopwords'

export interface Tokenizer {
	(text: string): string[]
}

export interface TokenizerOptions {
	splitter?: (text: string) => string[]
	cleaner?: (token: string) => string
	keeper?: (token: string) => boolean
	grams?: number
}

const split = (text: string) => text.toLowerCase().split(/[\s,]/g)

const clean = (token: string) => token.trim().replace(/[^\w]/g, '')

const keep = (token: string, stopwords: Set<string>) =>
	token.length > 1 && !stopwords.has(token)

export async function createTokenizer({
	splitter = split,
	cleaner = clean,
	keeper,
	grams = 1,
}: TokenizerOptions): Promise<Tokenizer> {
	const stopwords = await set()
	const filter = keeper ? keeper : (token: string) => keep(token, stopwords)

	return (text: string) => {
		const tokens = splitter(text).map(cleaner).filter(filter)
		const results: { [key: string]: boolean } = {}
		for (let i = 0; i < tokens.length; i++) {
			// roll up all the gram options from 1 to n
			// i.e., if tri-grams are requested, we'll get 1, 2, and 3 length sets
			for (let n = 1; n <= grams; n++) {
				// always sort alpha so permutations disregard order
				results[
					tokens
						.slice(i, i + n)
						.sort()
						.join(' ')
				] = true
			}
		}
		return Object.keys(results)
	}
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { union, intersect, complement } from './sets'

interface DiffObject {
	set: Set<string>
	match: number[]
	complement: Set<string>
}

interface ColorObject {
	color?: string
	colorClass?: string
}

export function diffSentences(
	leftContent: string,
	rightContent: string,
	jaccardThreshold: number,
): {
	leftDiff: DiffObject[]
	rightDiff: DiffObject[]
} {
	const c1Sentences = parseSentences(leftContent)
	const c2Sentences = parseSentences(rightContent)

	const leftDiff = parseSentencesIntoWordSets(c1Sentences).map(set => ({
		set,
	}))
	const rightDiff = parseSentencesIntoWordSets(c2Sentences).map(set => ({
		set,
	}))

	leftDiff.forEach((obj1: Partial<DiffObject>, i: number) => {
		const set1 = obj1.set as Set<string>
		rightDiff.forEach((obj2: Partial<DiffObject>, j: number) => {
			const set2 = obj2.set as Set<string>
			const uni = union(set1, set2)
			const isect = intersect(set1, set2)
			const score = isect.size / uni.size
			if (score > jaccardThreshold) {
				// NOTE: this takes a "last one wins" approach. we may want to make an array of matches
				obj1.match ? obj1.match.push(j) : (obj1.match = [j])
				obj2.match ? obj2.match.push(i) : (obj2.match = [i])
				obj1.complement = complement(set1, set2)
				obj2.complement = complement(set2, set1)
			}
		})
	})

	return {
		leftDiff: leftDiff as DiffObject[],
		rightDiff: rightDiff as DiffObject[],
	}
}

/**
 * Takes a pair of diffed documents and assigns colors.
 * These colors are assigned from a rotating color palette,
 * the function just makes sure they align for left and right.
 * TODO: take a d3 color scale/interpolator
 */
export function colorizeDiff(
	leftDiff: DiffObject[],
	rightDiff: DiffObject[],
	colors: string[],
): {
	leftColored: (DiffObject & ColorObject)[]
	rightColored: (DiffObject & ColorObject)[]
} {
	// keep track of colors for the match indices so we align them
	const colorHash: Record<string, string> = {}
	let colorIndex = 0
	let classCounter = 0
	const classHash: Record<string, string> = {}
	const leftColored = leftDiff.map((diff, index) => {
		if (diff.match) {
			// use source color matching
			let color = colors[colorIndex++]
			let colorClass = `diff-colorclass-${classCounter++}`
			diff.match.forEach((i: number) => {
				color = colorHash[i] ? colorHash[i] : color
				colorClass = classHash[i] ? classHash[i] : colorClass
				colorHash[i] = color
				classHash[i] = colorClass
			})

			if (colorIndex === colors.length) {
				colorIndex = 0
			}
			return { ...diff, color, colorClass }
		}
		return { ...diff }
	})
	const rightColored = rightDiff.map((diff: DiffObject, index: number) => {
		if (diff.match) {
			const color = colorHash[index]
			const colorClass = classHash[index]
			return { ...diff, color, colorClass }
		}

		return { ...diff }
	})

	return {
		leftColored,
		rightColored,
	}
}

/**
 * Parses plain text content into an array of cleanish sentences ready to diff
 * @param content
 */
export function parseSentences(content: string): string[] {
	const cleaned = content.replace(/”|“/g, '"').replace(/’/g, "'")
	const sentences = cleaned.split(/(?<![A-Z])\./)
	// remove any misleading ... values and remove leading whitespace
	const trimmed = sentences.map(s => s.trim())
	return trimmed.filter(s => s.length >= 2)
}

/**
 * Turns a list of sentences into a list of Set<word> for each
 * @param sentences
 */
export const parseSentencesIntoWordSets = (
	sentences: string[],
): Set<string>[] => {
	return sentences.map(sentence => {
		const words = parseWords(sentence)
		return new Set(words)
	})
}

/**
 * Parses a sentence into a list of words
 */
export function parseWords(sentence: string): string[] {
	const words = sentence.split(' ')
	return words.map(word => word.replace(/[,/#!$%^&*;:{}=\-_`~()]/g, ''))
}

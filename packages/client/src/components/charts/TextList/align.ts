/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const GRAM_LENGTH = 3
const BLANK = ' '

// TODO: there is a bug in this algorithm that can cause overwriting
// of words in certain scenarios, which may not represent all variants correctly

/**
 * Turn a list of words/tokens into a rolling list of n-grams.
 * At the end, they will pad with blanks
 * @param {*} list
 * @param {*} n
 */
const makeGrams = (list, n) =>
	list.map(line =>
		line.map((word, index) => {
			let words = line.slice(index, index + n)
			if (words.length < n) {
				words = [...words, ...new Array(n - words.length).fill(BLANK)]
			}
			return words
		}),
	)

/**
 * Compare two grams for exact match.
 * (i.e., compare the elements in two arrays)
 * @param {*} left
 * @param {*} right
 */
const compareGrams = (left, right) => {
	if (!left || !right || left.length !== right.length) {
		return false
	}
	return left.every((word, index) => word === right[index])
}

/**
 * Confirms that the majority of a pair of n-grams match each other.
 * Note that the first entry must match, in order to keep the placement
 * correct.
 * @param {*} gram1
 * @param {*} gram2
 */
const majority = (gram1, gram2) => {
	let count = 0
	gram1.forEach((g, i) => {
		if (g === gram2[i]) {
			count++
		}
	})
	return gram1[0] === gram2[0] && gram1.length - count === 1
}

/**
 * Predicate to confirm that every row has at least one blank
 * in one of the two supplied columns.
 * @param {*} grid
 * @param {*} col1
 * @param {*} col2
 */
const eitherBlank = (grid, col1, col2) => {
	const spaces = grid.every(row => row[col1] === BLANK || row[col2] === BLANK)
	return spaces
}

/**
 * Remap a grid to squeeze two columns together by eliminating
 * spaces in either the left or right, depending which is blank.
 * This can ONLY work properly if every row has a blank in
 * one of the columns, otherwise we'd be splicing out valid values.
 * @param {*} grid
 * @param {*} col1
 * @param {*} col2
 */
const compressBetweenTwoColumns = (grid, col1, col2) => {
	return grid.map(row => {
		const idx = row[col1] === BLANK ? col1 : col2
		return [...row.slice(0, idx), ...row.slice(idx + 1)]
	})
}

/**
 * Recursive pairwise comparison of grid columns to see if they can be moved closer together.
 * Criteria: at least one of every column element must be a space, indicating they can slide together without
 * disrupting other alignments later in the grid
 */
const compress = grid => {
	const comp = (g, s, e) => {
		const colCount = g[0].length
		if (s < colCount && e < colCount) {
			if (eitherBlank(g, s, e)) {
				const cg = compressBetweenTwoColumns(g, s, e)
				return comp(cg, s, s + 1)
			}
			return comp(g, s + 1, s + 2)
		}
		return g
	}
	return comp(grid, 0, 1)
}

/**
 * Confirm that an array has only spaces between the start and end indices.
 * @param {*} arr
 * @param {*} start
 * @param {*} end
 */
const onlyBlanks = (arr, start?, end?) => {
	const s = start || 0
	const e = end || arr.length
	return arr.slice(s, e).every(el => el === BLANK)
}

const findWordInRowPrior = (word, arr, others, fromIndex) => {
	if (word === BLANK) {
		return -1
	}
	let min = -1
	for (let i = 0; i < others.length; i++) {
		const row = others[i]
		for (let j = fromIndex - 1; j >= 0; j--) {
			if (row[j] === word) {
				if (min < 0) {
					min = j
				} else {
					min = Math.min(min, j)
				}
			}
		}
	}
	return min
}

const findWordInRowAfter = (word, arr, others, fromIndex) => {
	if (word === BLANK) {
		return -1
	}
	for (let i = 0; i < others.length; i++) {
		const row = others[i]
		for (let j = fromIndex + 1; j < row.length; j++) {
			if (row[j] === word) {
				return j
			}
		}
	}
	return -1
}

/**
 * Our gram placement favors last-one-wins positioning.
 * This means that complicated duplicate grams can send
 * words toward the end of the row, disrupting their alignment.
 * This routine looks at each word and determines if it can
 * pull it forward in the row.
 * It then re-runs in the opposite direction, pushing forward words
 * that were always further forward in the array than other matches
 * Criteria: there must be (a) a copy of the word in a different row,
 * at a lower/higher index, and (b) there must be an uninterupted sequence of spaces
 * between them.
 * @param {*} grid
 */
const shiftWords = grid => {
	const pulled = [...grid].map((row, index) => {
		const copy = [...row]
		const others = [...grid]
		others.splice(index, 1)
		for (let i = 0; i < copy.length; i++) {
			const word = copy[i]
			const prior = findWordInRowPrior(word, copy, others, i)
			const delta = i - prior
			if (prior >= 0 && delta > 0) {
				if (onlyBlanks(copy, prior, i)) {
					copy.splice(prior, 1, word)
					copy.splice(i, 1, BLANK)
				}
			}
		}
		return copy
	})
	const pushed = pulled.map((row, index) => {
		const copy = [...row]
		const others = [...pulled]
		others.splice(index, 1)
		for (let i = 0; i < copy.length; i++) {
			const word = copy[i]
			const after = findWordInRowAfter(word, copy, others, i)
			const delta = after - i
			if (after >= 0 && delta > 0) {
				if (onlyBlanks(copy, i + 1, after)) {
					copy.splice(after, 1, word)
					copy.splice(i, 1, BLANK)
				}
			}
		}
		return copy
	})
	return pushed
}

const onlyOneBlank = column => {
	let index = -1
	let blanks = 0
	for (let i = 0; i < column.length; i++) {
		if (column[i] === BLANK) {
			blanks++
		} else {
			index = i
		}
	}
	if (blanks === column.length - 1) {
		return index
	}
	return -1
}

// if the word at index is found in any other index, return false
const onlyOneInstance = (column, index) => {
	const word = column[index]
	if (word === BLANK) {
		return true
	}
	let count = 0
	for (let i = 0; i < column.length; i++) {
		if (column[i] === word) {
			count++
		}
	}
	return count === 1
}

/**
 * This "bubbles" columns forward to push out blanks
 * and fill in overlaps as much as possible.
 * It operates just like a bubble sort.
 */
const bubble = grid => {
	const edited = [...grid]
	const length = grid[0].length
	let bubbled = false
	do {
		bubbled = false
		for (let i = 0; i < length - 1; i++) {
			const j = i + 1
			const column1 = edited.map(row => row[i])
			const column2 = edited.map(row => row[j])
			const col1NonBlankIndex = onlyOneBlank(column1)
			const col2NonBlankIndex = onlyOneBlank(column2)
			const col1AllBlank = onlyBlanks(column1)
			const col2AllBlank = onlyBlanks(column2)
			if (col1AllBlank && !col2AllBlank) {
				// push blank columns toward the end for eventual trimmming
				edited.forEach(row => {
					const first = row[i]
					const second = row[j]
					row[i] = second
					row[j] = first
				})
			} else if (
				col1NonBlankIndex >= 0 &&
				col1NonBlankIndex !== col2NonBlankIndex
			) {
				const onlyInstance = onlyOneInstance(column2, col1NonBlankIndex)
				if (onlyInstance && !col2AllBlank) {
					bubbled = true
					edited.forEach((row, index) => {
						if (index !== col1NonBlankIndex) {
							const first = row[i]
							const second = row[j]
							row[i] = second
							row[j] = first
						}
					})
				}
			}
		}
	} while (bubbled === true)

	const lastNonBlankIndex = edited.reduce((furthest, row) => {
		const last = row.reduce((acc, cur, idx) => {
			if (cur !== BLANK) {
				return Math.max(acc, idx)
			}
			return acc
		}, -1)
		return Math.max(furthest, last)
	}, -1)
	if (lastNonBlankIndex >= 0) {
		return edited.map(row => row.slice(0, lastNonBlankIndex + 1))
	}
	return edited
}

/**
 * Finds the longest string in each column,
 * then pads all rows so the columns are always the same width.
 * This is for monospace display of the grid so that everything aligns.
 * @param {*} rows
 */
const padWords = rows => {
	const length = rows[0].length
	const longest: number[] = []
	for (let i = 0; i < length; i++) {
		longest.push(
			rows.reduce((acc, cur) => Math.max(acc, cur[i] ? cur[i].length : 0), 0),
		)
	}
	return rows.map(row => {
		return row.map((word, index) => {
			const len = longest[index]
			const chars = word.split('')
			const delta = len - chars.length
			return [...chars, ...new Array(delta).fill(' ')].join('')
		})
	})
}

export const compare = variants => {
	const splits = variants.map(v => v.split(/\s/))
	const grammed = makeGrams(splits, GRAM_LENGTH)

	const firstLine = grammed[0]
	const remaining = grammed.slice(1)

	let master = firstLine.map(w => w)
	remaining.forEach(secondLine => {
		let lastMasterMatch = 0
		for (let i = 0; i < secondLine.length; i++) {
			const secondTrigram = secondLine[i]
			let matchIndex = -1
			let firstGramMatch = false
			for (let j = lastMasterMatch; j < master.length; j++) {
				const firstTrigram = master[j]
				const match = compareGrams(firstTrigram, secondTrigram)
				if (match) {
					lastMasterMatch = j
					matchIndex = j
					break
				} else if (majority(firstTrigram, secondTrigram)) {
					firstGramMatch = true
					lastMasterMatch = j
					break
				}
			}
			if (matchIndex < 0 && !firstGramMatch) {
				if (lastMasterMatch === 0) {
					const ins = i
					master = [
						...master.slice(0, ins),
						secondTrigram,
						...master.slice(ins),
					]
				} else {
					const ins = ++lastMasterMatch
					master = [
						...master.slice(0, ins),
						secondTrigram,
						...master.slice(ins),
					]
				}
			}
		}
	})

	const rows = grammed.map((row, index) => {
		const output = master.map(() => new Array(GRAM_LENGTH).fill(BLANK))
		let lastMatch = 0
		for (let i = 0; i < master.length; i++) {
			const masterGram = master[i]
			for (let j = lastMatch; j < row.length; j++) {
				const compareGram = row[j]
				if (
					compareGrams(compareGram, masterGram) ||
					majority(compareGram, masterGram)
				) {
					output[i] = masterGram
					lastMatch = j + 1
					break
				}
			}
		}

		return output
	})

	const ungrammed = rows.map(row => row.map(gram => gram[0]))
	const shifted = shiftWords(ungrammed)
	const compressed = compress(shifted)
	const bubbled = bubble(compressed)
	const padded = padWords(bubbled)

	return padded
}

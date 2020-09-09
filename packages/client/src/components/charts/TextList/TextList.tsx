/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import React, { useMemo, memo } from 'react'
import styled from 'styled-components'

import { compare } from './align'

interface ListProps {
	lines: string[]
	diff?: boolean
	style?: React.CSSProperties
	className?: string
}

/**
 * This is a plain text viewer that shows monospaced rows so they can be visually compared for alignment.
 * Passing the diff prop will run a comparison algo and only show aligned changes.
 * This algo (see align.ts file) assumes the first row is the 'root' to compare to.
 */
export const TextList: React.FC<ListProps> = memo(function TextList({
	lines,
	diff,
	style,
	className,
}) {
	const theme = useThematic()
	const rows = useMemo(() => {
		if (lines.length > 0 && diff) {
			const addedColor = theme.application().foreground().hex()
			const matchColor = theme.application().lowContrast().hex()
			const aligned = compare(lines)
			const elements = aligned.map((row, rowIndex) => {
				return row.map((word, wordIndex) => {
					// if the word has been found in ANY PREVIOUS row, fade it out
					const previous = aligned
						.slice(0, rowIndex)
						.some(prevRow => prevRow[wordIndex] === word)
					return (
						<StyledSpan
							key={`${rowIndex}-${wordIndex}-${word}`}
							color={previous ? matchColor : addedColor}
						>
							{word}&nbsp;
						</StyledSpan>
					)
				})
			})
			return elements
		} else {
			return lines.map(variant => <span key={variant}>{variant}</span>)
		}
	}, [lines, diff, theme])
	return (
		<StyledPre style={style} className={className}>
			{rows.map((row, i) => (
				<StyledDiv key={`variant-row-${i}`}>{row}</StyledDiv>
			))}
		</StyledPre>
	)
})

const StyledPre = styled.pre`
	margin-top: 2px;
	margin-right: 2px;
	min-height: 50px;
`

const StyledDiv = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 16px;
`

const StyledSpan = styled.span<{ color: string }>`
	color: ${props => props.color};
`

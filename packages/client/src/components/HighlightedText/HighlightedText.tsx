/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import React, { memo, useMemo } from 'react'
import Highlighter from 'react-highlight-words'

interface HighlightedTextProps {
	text: string
	highlight?: string
}

export const HighlightedText: React.FC<HighlightedTextProps> = memo(
	function HighlightedText({ text, highlight }) {
		const theme = useThematic()
		const highlightStyle = useMemo(
			() => ({
				paddingLeft: 2,
				paddingRight: 2,
				background: theme.rect().fill().css(0.3),
			}),
			[theme],
		)
		const searchWords = useMemo(() => {
			if (!highlight) {
				return []
			}
			const clean = highlight.replace(/^["']|["']$/g, '')
			// highlight the full phrase to fill background color, or individual words
			return [clean, ...clean.split(/\s/)]
		}, [highlight])
		return (
			<Highlighter
				searchWords={searchWords}
				textToHighlight={text}
				highlightStyle={highlightStyle}
			/>
		)
	},
)

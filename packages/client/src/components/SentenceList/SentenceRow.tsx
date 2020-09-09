/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sentence } from '@newsthreads/schema/lib/client-types'
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { useToggle, useSearch } from '../../hooks'
import { HighlightedText } from '../HighlightedText'
import { ExpandedSentence } from './ExpandedSentence'
import { SentenceRowIcons } from './SentenceRowIcons'

interface SentenceRowProps {
	sentence: Sentence
}

export const SentenceRow: React.FC<SentenceRowProps> = memo(
	function SentenceRow({ sentence }) {
		const theme = useThematic()
		const [expanded, handleExpandClick] = useToggle()
		const [toggled, handleToggleClick] = useToggle()
		const [headlines, handleHeadlinesToggleClick] = useToggle()
		const [query] = useSearch<string>('query')
		return (
			<Container theme={theme}>
				<SentenceMeta>
					<SentenceRowIcons sentence={sentence} onClick={handleExpandClick} />
				</SentenceMeta>
				<SentenceBody>
					<SentenceHighlight>
						<HighlightedText text={sentence.text} highlight={query} />
					</SentenceHighlight>
					{expanded ? (
						<ExpandedSentence
							sentence={sentence}
							toggled={toggled}
							showHeadlines={headlines}
							onToggleVariants={handleToggleClick}
							onToggleHeadlines={handleHeadlinesToggleClick}
						/>
					) : null}
				</SentenceBody>
			</Container>
		)
	},
)
const Container = styled.div<{ theme: Theme }>`
	display: flex;
	border-bottom: 1px solid ${props => props.theme.application().faint().hex()};
	width: 100%;
	overflow-x: hidden;
`
const SentenceHighlight = styled.div`
	margin-top: 4px;
`
const SentenceMeta = styled.div`
	width: 60px;
`
const SentenceBody = styled.div`
	flex: 2;
	margin-left: 4;
	overflow-x: hidden;
`

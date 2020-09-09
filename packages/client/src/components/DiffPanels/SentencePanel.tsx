/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Document, Sentence } from '@newsthreads/schema/lib/client-types'
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { DocumentHeader } from '../DocumentHeader'

const HOVER_OPACITY = 0.4

interface SentencePanelProps {
	document: Document
	sentences: Sentence[]
	colorScale: (sourceId: number) => string
	// map of source Ids to words that are not contained in both sentences
	diffMap?: Map<number, Set<string>>
	color?: string // the diff color
	onHover: (sourceId: number) => void
	hover?: number // source id of the hovered sentence across panels
}

interface MarkedSentenceProps {
	text: string
	wordSet?: Set<string>
}

/**
 * Marks up a text string with special style for words that are in a predefined set.
 * @param param0
 */
const MarkedSentence = ({ text, wordSet }) => {
	if (!wordSet) {
		return <span>{text}</span>
	}
	const splits = text.split(/\s/)
	return (
		<>
			{splits.map((token, idx) => {
				const has = wordSet.has(token)
				return (
					<span
						key={`bold-tokens-${text}-${idx}`}
						style={{
							fontWeight: has ? 'bold' : 'normal',
						}}
					>
						{token}{' '}
					</span>
				)
			})}
		</>
	)
}

export const SentencePanel: React.FC<SentencePanelProps> = memo(
	function SentencePanel({
		document,
		sentences,
		colorScale,
		diffMap,
		color,
		onHover,
		hover = -1,
	}) {
		const theme = useThematic()
		return (
			<div>
				<StyledDocumentHeader
					document={document}
					selected={true}
					theme={theme}
					mark={color}
				/>
				{sentences.map(s => (
					<SentenceContainer
						key={`diff-line-${document.docid}-${s.sid}`}
						sentence={s}
						hover={hover}
						theme={theme}
						colorScale={colorScale}
						onMouseOver={() => onHover(s.sourceId)}
						onMouseOut={() => onHover(-1)}
						onBlur={() => onHover(-1)}
						onFocus={() => onHover(s.sourceId)}
					>
						<MarkedSentence text={s.text} wordSet={diffMap?.get(s.sourceId)} />
					</SentenceContainer>
				))}
			</div>
		)
	},
)

const StyledDocumentHeader = styled(DocumentHeader)<{ theme: Theme }>`
	height: 54px;
	border-bottom: 1px solid
		${props => props.theme.application().lowContrast().hex()};
`
const SentenceContainer = styled.div<{
	sentence: Sentence
	hover: number
	theme: Theme
	colorScale: (sourceId: number) => string
}>`
	margin: 10px;
	background: ${p =>
		p.sentence.sourceId === p.hover
			? p.theme.application().accent().css(HOVER_OPACITY)
			: p.colorScale(p.sentence.sourceId)};
`

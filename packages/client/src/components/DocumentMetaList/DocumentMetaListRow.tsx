/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Document, Sentence } from '@newsthreads/schema/lib/client-types'
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { date } from '../../util/format'
import { Domain } from '../Domain'

interface RowProps {
	sentence: Sentence
	selected: Document | null
	showHeadlines?: boolean
}

export const DocumentMetaListRow: React.FC<RowProps> = memo(
	function DocumentMetaListRow({ sentence, selected, showHeadlines = false }) {
		const theme = useThematic()
		const color =
			selected != null && sentence.document.docid === selected.docid
				? theme.application().accent().hex()
				: theme.application().foreground().hex()
		return (
			<Container>
				<ColorDiv color={color}>{date(sentence.document.date)}</ColorDiv>
				<DomainStyled
					domain={sentence.document.domain}
					maxDomainChars={20}
					gemRadius={5}
					showGem={true}
				/>
				{showHeadlines ? (
					<Headline theme={theme}>{sentence.document.title}</Headline>
				) : null}
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	height: 16px;
	align-items: center;
`

const DomainStyled = styled(Domain)`
	width: 160px;
`

const ColorDiv = styled.div<{ color: string }>`
	width: 160px;
	color: ${props => props.color};
`

const Headline = styled.div<{ theme: Theme }>`
	margin-right: 12px;
	font-weight: bold;
	color: ${props => props.theme.application().midContrast().hex()};
`

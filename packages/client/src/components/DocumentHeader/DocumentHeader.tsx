/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Document } from '@newsthreads/schema/lib/client-types'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import { date } from '../../util/format'
import { Domain } from '../Domain'

interface DocumentHeaderProps {
	document: Document
	className?: string
	selected?: boolean
	relevance?: number
	style?: React.CSSProperties
	mark?: string // mark color to tie visually with other appearances of doc
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = memo(
	function DocumentHeader({
		document,
		className,
		selected,
		relevance,
		style,
		mark,
	}) {
		const theme = useThematic()
		const foreground = theme.application().midContrast().hex()
		const accent = theme.application().accent().hex()
		return (
			<Container style={style} className={className}>
				<FlexStart>
					<DocumentTitle
						color={selected ? accent : foreground}
						selected={selected}
					>
						{document.title}
					</DocumentTitle>
				</FlexStart>
				<FlexSpaceBetween>
					<DateDiv>{date(document.date)}</DateDiv>
					<Domain domain={document.domain} link={document.url} />
				</FlexSpaceBetween>
			</Container>
		)
	},
)

const Flex = styled.div`
	display: flex;
`

const Container = styled(Flex)`
	margin: 8px;
	margin-bottom: 4px;
	flex-direction: column;
	justify-content: space-between;
`

const FlexStart = styled(Flex)`
	align-items: flex-start;
`

const DocumentTitle = styled.div<{
	selected: boolean | undefined
	color: string
}>`
	font-size: 12px;
	margin-left: 0;
	font-weight: bold;
	color: ${props => props.color};
`

const FlexSpaceBetween = styled(Flex)`
	margin-top: 8px;
	font-size: 0.65em;
	justify-content: space-between;
`

const DateDiv = styled.div`
	margin-bottom: 4px;
`

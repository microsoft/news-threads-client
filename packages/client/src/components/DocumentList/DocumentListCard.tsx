/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDimensions } from '@essex-js-toolkit/hooks'
import { DocumentCard } from '@fluentui/react'
import { Document } from '@newsthreads/schema/lib/client-types'
import { useThematic } from '@thematic/react'
import React, { useCallback, useRef, memo } from 'react'
import styled from 'styled-components'
import { DocumentGems } from '../DocumentGems'
import { DocumentHeader } from '../DocumentHeader'
import { Triangle } from '../Triangle'

const ARROW_WIDTH = 10

interface CardProps {
	document: Document
	selected: Document | null
	onClick?: (docid: string) => void
	score?: number
}

const documentCardStyles = {
	root: {
		marginBottom: 8,
		marginRight: 0,
		// this is hard-coded to 320px in ui fabric
		maxWidth: '100%',
	},
}

export const Card: React.FC<CardProps> = memo(function Card({
	document,
	selected,
	onClick,
	score,
}) {
	const theme = useThematic()
	const ref = useRef(null)
	const dimensions = useDimensions(ref)
	const handleClick = useCallback(() => {
		if (onClick) {
			onClick(document.docid)
		}
	}, [onClick, document])
	const matched = selected != null && selected.docid === document.docid
	return (
		<Container ref={ref}>
			<DynamicWidth width={dimensions ? dimensions.width + 'px' : '100%'}>
				<DocumentCard
					key={document.docid}
					styles={documentCardStyles}
					onClick={handleClick}
				>
					<DocumentHeader
						document={document}
						relevance={score}
						selected={matched}
					/>
					<DocumentGems document={document} score={score} />
				</DocumentCard>
			</DynamicWidth>
			{matched ? (
				<Triangle
					width={ARROW_WIDTH}
					height={dimensions ? dimensions.height - 8 : 0}
					color={theme.application().accent().hex()}
				/>
			) : null}
		</Container>
	)
})

const Container = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-start;
`

const DynamicWidth = styled.div<{ width: string }>`
	width: ${props => props.width};
`

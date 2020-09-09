/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { Sentence } from '@newsthreads/schema/lib/client-types'
import React, { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useDiffColor, useDiffDocument } from '../../hooks'
import { DiffSide } from '../../state'
import { Visible } from '../Visible'
import { SentencePanel } from './SentencePanel'
import { useIntersectionColors, useIntersectionWords } from './hooks'

export const DiffPanels: React.FC = memo(function DiffPanels() {
	const [left, leftLoading] = useDiffDocument(DiffSide.Left)
	const [right, rightLoading] = useDiffDocument(DiffSide.Right)
	const leftColor = useDiffColor(DiffSide.Left)
	const rightColor = useDiffColor(DiffSide.Right)
	const [hover, setHover] = useState<number>(-1)

	const handleHover = useCallback(sourceId => {
		setHover(sourceId)
	}, [])
	const colorScale = useIntersectionColors(left?.sentences, right?.sentences)
	const wordMap = useIntersectionWords(left?.sentences, right?.sentences)

	return (
		<Container>
			<FlexDiv>
				{left ? (
					<SentencePanel
						document={left}
						sentences={left.sentences as Sentence[]}
						colorScale={colorScale}
						diffMap={wordMap}
						color={leftColor}
						hover={hover}
						onHover={handleHover}
					/>
				) : (
					<Visible show={leftLoading}>
						<Spinner />
					</Visible>
				)}
			</FlexDiv>
			<FlexDiv>
				{right ? (
					<SentencePanel
						document={right}
						sentences={right.sentences as Sentence[]}
						colorScale={colorScale}
						diffMap={wordMap}
						color={rightColor}
						hover={hover}
						onHover={handleHover}
					/>
				) : (
					<Visible show={rightLoading}>
						<Spinner />
					</Visible>
				)}
			</FlexDiv>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
`

const FlexDiv = styled.div`
	flex: 1;
`

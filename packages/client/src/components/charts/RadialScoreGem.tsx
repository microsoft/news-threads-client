/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SelectionState } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { scaleLinear } from 'd3-scale'
import { arc } from 'd3-shape'
import React, { memo, useMemo, CSSProperties } from 'react'
import styled from 'styled-components'

export interface RadialScoreGemProps extends Partial<RingProps> {
	className?: string
	style?: CSSProperties
	/**
	 * A score value between 0-1
	 */
	score: number

	/**
	 * The color of the arc
	 */
	fill: string

	noData?: boolean
}

const DEFAULT_RADIUS = 6
const DEFAULT_ARC_WIDTH = 2
const DEFAULT_SCALE = scaleLinear().range([0, Math.PI * 2])

export const RadialScoreGem: React.FC<RadialScoreGemProps> = memo(
	function RadialScoreGem({
		score,
		fill,
		className,
		style,
		noData,
		radius = DEFAULT_RADIUS,
		arcWidth = DEFAULT_ARC_WIDTH,
		scale = DEFAULT_SCALE,
	}) {
		const diameter = 2 * radius
		const noDataFill = useNoDataFill()
		const emptyFill = useEmptyFill()
		const dataPathFill = useMemo(() => (noData ? noDataFill : fill), [
			noData,
			noDataFill,
			fill,
		])
		const dataScore = useMemo(() => (noData ? 1 : score), [noData, score])
		return (
			<Container diameter={diameter} className={className} style={style}>
				<Ring
					radius={radius}
					arcWidth={arcWidth}
					scale={scale}
					score={1}
					fill={emptyFill}
				/>
				<Ring
					radius={radius}
					arcWidth={arcWidth}
					scale={scale}
					fill={dataPathFill}
					score={dataScore}
				/>
			</Container>
		)
	},
)

export interface RingProps {
	radius: number
	arcWidth: number
	scale: (d: number) => number
	fill: string
	score: number
}
const Ring: React.FC<RingProps> = memo(function Ring({
	radius,
	arcWidth,
	scale,
	fill,
	score,
}) {
	const diameter = 2 * radius
	const path = useArcPath(score, radius, arcWidth, scale)
	const pathStyle = useMemo<CSSProperties>(
		() => ({ transform: `translate(${radius}px,${radius}px` }),
		[radius],
	)
	return (
		<path
			d={path}
			fill={fill}
			height={diameter}
			width={diameter}
			style={pathStyle}
		/>
	)
})

function useEmptyFill(): string {
	const theme = useThematic()
	return useMemo(() => theme.plotArea().fill().hex(), [theme])
}

function useNoDataFill(): string {
	const theme = useThematic()
	return useMemo(
		() => theme.arc({ selectionState: SelectionState.NoData }).fill().hex(),
		[theme],
	)
}
function useArcPath(
	score: number,
	radius: number,
	arcWidth: number,
	scale,
): string {
	return useMemo(
		() =>
			arc()({
				outerRadius: radius,
				innerRadius: radius - arcWidth,
				startAngle: 0,
				endAngle: scale(score || 0),
			}) || '',
		[score, radius, arcWidth, scale],
	)
}

const Container = styled.svg<{ diameter: number }>`
	width: ${({ diameter }) => diameter}px;
	height: ${({ diameter }) => diameter}px;
	min-width: ${({ diameter }) => diameter}px;
	min-height: ${({ diameter }) => diameter}px;
`

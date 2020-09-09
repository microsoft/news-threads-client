/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { select } from 'd3-selection'
import React, { useRef, useLayoutEffect, memo } from 'react'

interface MagBarProps {
	progress: number
	size?: number
}

/**
 * This creates a progress-style bar.
 * It is monotone, using a foreground color for the progress,
 * and a lighter variant for the background.
 * TODO: support horizontal
 */
export const MagBar: React.FC<MagBarProps> = memo(function MagBar({
	progress,
	size = 48,
}) {
	const theme = useThematic()
	const ref = useRef(null)

	useLayoutEffect(() => {
		const foreground = theme.scales().nominal(10)(0).hex()
		const background = theme.scales().nominalMuted(10)(0).hex()

		select(ref.current).select('svg').remove()

		const g = select(ref.current)
			.append('svg')
			.attr('width', size / 4)
			.attr('height', size)
			.append('g')

		const data = [
			{
				y: size * (1 - progress),
				height: size * progress,
				value: progress,
			},
			{
				y: 0,
				height: size * (1 - progress),
				value: 1 - progress,
			},
		]

		g.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('fill', (d, i) => (i === 0 ? foreground : background))
			.attr('width', size / 4)
			.attr('height', d => d.height)
			.attr('y', d => d.y)
	}, [theme, progress, size])

	return <div ref={ref} />
})

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'

enum ArrowDirection {
	Right,
	Left,
	Up,
	Down,
}

interface TriangleProps {
	width: number
	height: number
	direction?: ArrowDirection
	color?: string
}

/**
 * Renders a filled triangle using CSS.
 * Note that this uses a border trick, so only filled solid triangles are possible.
 * This could be upgraded to SVG to get more flexibility.
 */
export const Triangle: React.FC<TriangleProps> = memo(function Triangle({
	width,
	height,
	direction = ArrowDirection.Right,
	color = 'black',
}) {
	let style: React.CSSProperties = {
		width: 0,
		height: 0,
	}
	switch (direction) {
		case ArrowDirection.Right:
			style = {
				...style,
				borderTop: `${height / 2}px solid transparent`,
				borderBottom: `${height / 2}px solid transparent`,
				borderLeft: `${width}px solid ${color}`,
			}
			break
		case ArrowDirection.Left:
			style = {
				...style,
				borderTop: `${height / 2}px solid transparent`,
				borderBottom: `${height / 2}px solid transparent`,
				borderRight: `${width}px solid ${color}`,
			}
			break
		case ArrowDirection.Up:
			style = {
				...style,
				borderLeft: `${width / 2}px solid transparent`,
				borderRight: `${width / 2}px solid transparent`,
				borderBottom: `${height}px solid ${color}`,
			}
			break
		case ArrowDirection.Down:
			style = {
				...style,
				borderLeft: `${width / 2}px solid transparent`,
				borderRight: `${width / 2}px solid transparent`,
				borderTop: `${height}px solid ${color}`,
			}
			break
	}
	return <div style={style} />
})

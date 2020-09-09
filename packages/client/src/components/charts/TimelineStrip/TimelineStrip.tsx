/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Document } from '@newsthreads/schema/lib/client-types'
import { SelectionState } from '@thematic/core'
import { rect, svg } from '@thematic/d3'
import { useThematic } from '@thematic/react'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3-selection'
import React, { memo, useLayoutEffect, useRef } from 'react'

interface TimelineProps {
	documents: Document[]
	width: number
	height: number
	// optional document to highlight its position in the chart
	selected?: Document
}

export const TimelineStrip: React.FC<TimelineProps> = memo(
	function TimelineStrip({ documents, width, height, selected }) {
		const theme = useThematic()
		const ref = useRef(null)

		useLayoutEffect(() => {
			const dates = documents.map(d => Date.parse(d.date)).sort()
			const selectedIndex = selected
				? documents.findIndex(d => d.docid === selected.docid)
				: -1
			const xScale = scaleLinear()
				.domain([dates[0], dates[dates.length - 1]])
				.range([0, width])

			select(ref.current).select('svg').remove()
			const g = select(ref.current)
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.call(svg as any, theme.chart())
				.append('g')
			g.append('rect')
				.attr('width', width)
				.attr('height', height)
				.call(rect as any, theme.plotArea())

			const getSelectionState = i => {
				if (selectedIndex < 0) {
					return SelectionState.Normal
				}
				if (i === selectedIndex) {
					return SelectionState.Selected
				}
				return SelectionState.Suppressed
			}
			g.selectAll('.bar')
				.data(dates)
				.enter()
				.append('line')
				.attr('class', 'bar')
				.attr('x1', xScale)
				.attr('x2', xScale)
				.attr('y1', 0)
				.attr('y2', height)
				.attr('stroke', (d, i) =>
					theme
						.line({ selectionState: getSelectionState(i) })
						.stroke()
						.hex(),
				)
				.attr('stroke-opacity', (d, i) =>
					theme.line({ selectionState: getSelectionState(i) }).strokeOpacity(),
				)
				.attr('stroke-width', 1)
		}, [theme, documents, width, height, selected])
		return <div ref={ref} />
	},
)

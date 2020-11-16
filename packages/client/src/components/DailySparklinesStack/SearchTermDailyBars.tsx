/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { useDailyTermCounts } from '../../hooks'
import { TermBar } from '../charts/TermBar'

interface SearchTermDailyBarsProps {
	search: string
	width?: number
	height?: number
	barWidth?: number
	dateRange?: [Date, Date]
	selectionRange?: [Date, Date]
	markedDate?: Date
}

export const SearchTermDailyBars: React.FC<SearchTermDailyBarsProps> = memo(
	function SearchTermDailyBars({
		search,
		width = 800,
		height = 24,
		barWidth,
		dateRange,
		selectionRange,
		markedDate,
	}) {
		const [terms] = useDailyTermCounts(search, dateRange)
		return (
			<TermBar
				terms={terms}
				width={width}
				height={height}
				barWidth={barWidth}
				dateExtent={dateRange}
				selectionExtent={selectionRange}
				markedDate={markedDate}
			/>
		)
	},
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { useDailyQueryTokenCounts } from '../../hooks'
import { TermBar } from '../charts/TermBar'

interface QueryTokenDailyBarsProps {
	token: string
	width?: number
	height?: number
	barWidth?: number
	dateRange?: [Date, Date]
	selectionRange?: [Date, Date]
	markedDate?: Date
}

export const QueryTokenDailyBars: React.FC<QueryTokenDailyBarsProps> = memo(
	function QueryTokenDailyBars({
		token,
		width = 800,
		height = 24,
		barWidth,
		dateRange,
		selectionRange,
		markedDate,
	}) {
		const [terms] = useDailyQueryTokenCounts(token, dateRange)
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

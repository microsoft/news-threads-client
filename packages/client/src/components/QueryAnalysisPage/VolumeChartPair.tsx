/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'

import { QueryTokenDailyBars } from '../DailySparklinesStack/QueryTokenDailyBars'
import { SearchTermDailyBars } from '../DailySparklinesStack/SearchTermDailyBars'
import { TimeBrush } from '../charts/TimeBrush'

interface VolumeChartPairProps {
	text: string
	chartWidth: number
	chartHeight: number
	barWidth: number
	dateRange?: [Date, Date]
	onClose?: (text: string) => void
	title?: string
}

const AXIS_HEIGHT = 12
const ICON_SIZE = 8
const ICON_STYLES = { root: { width: ICON_SIZE, height: ICON_SIZE } }
const ICON_PROPS = {
	iconName: 'ChromeClose',
	styles: {
		root: { fontSize: ICON_SIZE, width: ICON_SIZE, height: ICON_SIZE },
	},
}

export const VolumeChartPair: React.FC<VolumeChartPairProps> = memo(
	function VolumeChartPair({
		text,
		chartWidth,
		chartHeight,
		barWidth,
		dateRange,
		onClose,
		title,
	}) {
		const theme = useThematic()
		const handleCloseClick = useCallback(() => {
			if (onClose) {
				onClose(text)
			}
		}, [text, onClose])
		const ttl = title || text
		return (
			<Container theme={theme}>
				<Header>
					<div />
					<TextLabel theme={theme}>{ttl}</TextLabel>
					{onClose ? (
						<IconButton
							onClick={handleCloseClick}
							styles={ICON_STYLES}
							iconProps={ICON_PROPS}
						/>
					) : (
						<div />
					)}
				</Header>
				<TermBarContainer>
					<VolumeLabel theme={theme}>Articles</VolumeLabel>
					<SearchTermDailyBars
						search={text}
						width={chartWidth}
						height={chartHeight}
						barWidth={barWidth}
						dateRange={dateRange}
					/>
				</TermBarContainer>
				<TermBarContainer>
					<VolumeLabel theme={theme}>Searches</VolumeLabel>
					<QueryTokenDailyBars
						token={text}
						width={chartWidth}
						height={chartHeight}
						barWidth={barWidth}
						dateRange={dateRange}
					/>
				</TermBarContainer>
				{dateRange ? (
					<TimeBrush
						dateRange={dateRange}
						width={chartWidth}
						height={AXIS_HEIGHT}
						barWidth={barWidth}
					/>
				) : null}
			</Container>
		)
	},
)
const Container = styled.div<{ theme: Theme }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8px 12px 12px 12px;
	border: 1px solid ${props => props.theme.application().faint().hex()};
`

const Header = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`

const TermBarContainer = styled.div`
	margin-bottom: 2px;
`

const VolumeLabel = styled.div<{ theme: Theme }>`
	font-size: 10px;
	color: ${props => props.theme.application().midContrast().hex()};
`

const TextLabel = styled.span<{ theme: Theme }>`
	color: ${props => props.theme.application().accent().hex()};
`

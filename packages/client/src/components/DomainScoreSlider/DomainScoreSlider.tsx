/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'rc-slider/assets/index.css'

import { IconButton } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { Range } from 'rc-slider'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useSearch } from '../../hooks'
import { SliderToolTip, SliderPosition } from '../SliderToolTip'

interface DateRangeProps {
	showMarks?: boolean
	className?: string
}

export const DomainScoreSlider: React.FC<DateRangeProps> = memo(
	function DomainScoreSlider({ showMarks = false }) {
		const theme = useThematic()
		const [minDomainScore, setMinDomainScore] = useSearch<number>(
			'minDomainScore',
		)
		const [maxDomainScore, setMaxDomainScore] = useSearch<number>(
			'maxDomainScore',
		)
		const [[min, max]] = useState([0, 100])

		const [localRange, setLocalRange] = useState([min, max])

		useEffect(
			function loadMinAndMaxDomainScore() {
				setLocalRange([+minDomainScore, +maxDomainScore])
			},
			[minDomainScore, maxDomainScore],
		)

		const marks = useMemo(() => {
			if (showMarks) {
				return {
					marks: {
						[min]: min,
						[max]: max,
					},
				}
			}
			return {}
		}, [showMarks, min, max])

		const handleOnAfterChange = useCallback(
			([minDomainScore, maxDomainScore]: [number, number]) => {
				setMinDomainScore(minDomainScore)
				setMaxDomainScore(maxDomainScore)
			},
			[setMinDomainScore, setMaxDomainScore],
		)

		const handleSlideChange = useCallback(
			(newRange: [number, number]) => {
				setLocalRange(newRange)
			},
			[setLocalRange],
		)

		// this is a handy shortcut to toggle between including all results
		// and including only rated untrustworthy domains
		const handleSnapButtonClick = useCallback(() => {
			const mn = minDomainScore === 0 ? 1 : min
			const mx = minDomainScore === 0 ? 59 : max
			handleOnAfterChange([mn, mx])
		}, [min, max, minDomainScore, handleOnAfterChange])

		const Handle = useMemo(() => {
			return SliderToolTip({
				theme: theme,
				alwaysShow: true,
				position: [SliderPosition.Top, SliderPosition.Bottom],
			})
		}, [theme])

		const styles = useMemo(() => {
			return {
				trackStyle: [
					{
						backgroundColor: theme.scales().nominal(10)(0).hex(),
					},
				],
				handleStyle: [
					{ border: `2px solid ${theme.scales().nominal(10)(0).hex()}` },
					{ border: `2px solid ${theme.scales().nominal(10)(0).hex()}` },
				],
				railStyle: {
					backgroundColor: theme.application().lowContrast().hex(),
				},
			}
		}, [theme])

		return (
			<Container>
				<IconButton
					iconProps={{ iconName: 'globe2' }}
					onClick={handleSnapButtonClick}
					title={
						minDomainScore === 0
							? 'Show rated untrustworthy domains only'
							: 'Reset to all domains'
					}
				/>
				<RangeContainer>
					<Range
						allowCross={false}
						value={localRange}
						min={min}
						max={max}
						{...marks}
						onChange={handleSlideChange}
						onAfterChange={handleOnAfterChange}
						handle={Handle}
						{...styles}
					/>
				</RangeContainer>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	align-items: center;
`

const RangeContainer = styled.div`
	margin: 20px 10px;
	display: block;
	width: 100%;
`

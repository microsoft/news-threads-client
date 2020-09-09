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

import { useSearch, useSelectedDataset } from '../../hooks'
import { SliderPosition, SliderToolTip } from '../SliderToolTip'
import {
	convertDateIntegerToIso,
	convertIsoToDateInteger,
	formatNumericDate,
} from './util'

interface DateRangeSliderProps {
	showMarks?: boolean
	className?: string
}

type NumberTuple = [number, number]

export const DateRangeSlider: React.FC<DateRangeSliderProps> = memo(
	function DateRangeSlider({ showMarks = false }) {
		const theme = useThematic()
		const dataset = useSelectedDataset()

		// Range slider works with integers.
		// Step size should be a day, not a ms.
		// Convert iso string to integer representing date
		const [min, max] = useMemo(() => {
			return [dataset?.startDate || '', dataset?.endDate || ''].map(date => {
				return convertIsoToDateInteger(date)
			})
		}, [dataset])
		const [from, setFrom] = useSearch<string>('from')
		const [to, setTo] = useSearch<string>('to')

		const [selectionRange, setSelectionRange] = useState<NumberTuple>([
			min,
			max,
		])

		useEffect(
			function loadSearchFromAndTo() {
				setSelectionRange([
					from ? convertIsoToDateInteger(from) : min,
					to ? convertIsoToDateInteger(to) : max,
				])
			},
			[from, to, min, max],
		)

		const marks = useMemo(() => {
			if (showMarks) {
				return {
					marks: {
						[min]: formatNumericDate(min),
						[max]: formatNumericDate(max),
					},
				}
			}
			return {}
		}, [showMarks, min, max])

		// Query with new date range
		const handleOnAfterChange = useCallback(
			([newFrom, newTo]: NumberTuple) => {
				// if date range is maxed out then reset the date filter
				const resetDateRange = newFrom === min && newTo === max
				const searchFrom = !resetDateRange
					? convertDateIntegerToIso(newFrom)
					: ''
				const searchTo = !resetDateRange ? convertDateIntegerToIso(newTo) : ''
				setFrom(searchFrom)
				setTo(searchTo)
			},
			[setFrom, setTo, min, max],
		)

		const handleSlideChange = useCallback(
			(newRange: NumberTuple) => {
				setSelectionRange(newRange)
			},
			[setSelectionRange],
		)

		const handleResetButtonClick = useCallback(() => {
			handleOnAfterChange([min, max])
		}, [min, max, handleOnAfterChange])

		const Handle = useMemo(() => {
			return SliderToolTip({
				alwaysShow: true,
				position: [SliderPosition.Top, SliderPosition.Bottom],
				formatter: formatNumericDate,
				theme: theme,
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
					iconProps={{ iconName: 'calendar' }}
					onClick={handleResetButtonClick}
					title="Reset to full date range"
				/>
				<RangeContainer>
					<Range
						allowCross={false}
						value={selectionRange}
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

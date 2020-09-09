/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'rc-slider/assets/index.css'

import { IconButton } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { format } from 'd3-format'
import { Range } from 'rc-slider'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSearch } from '../../hooks'
import { SliderToolTip, SliderPosition } from '../SliderToolTip'

const hundreds = format('.2f')

interface VariationSliderProps {
	showMarks?: boolean
	className?: string
}

export const VariationSlider: React.FC<VariationSliderProps> = memo(
	function VariationSlider({ showMarks = false }) {
		const theme = useThematic()
		const [minInstanceVariantRatio, setMinInstanceVariantRatio] = useSearch<
			number
		>('minInstanceVariantRatio')
		const [maxInstanceVariantRatio, setMaxInstanceVariantRatio] = useSearch<
			number
		>('maxInstanceVariantRatio')
		const [[min, max]] = useState([0, 1])

		const [localRange, setLocalRange] = useState([min, max])

		useEffect(
			function loadMinAndMaxInstanceVariantRatios() {
				setLocalRange([+minInstanceVariantRatio, +maxInstanceVariantRatio])
			},
			[minInstanceVariantRatio, maxInstanceVariantRatio],
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
			([minRatio, maxRatio]: [number, number]) => {
				setMinInstanceVariantRatio(minRatio)
				setMaxInstanceVariantRatio(maxRatio)
			},
			[setMinInstanceVariantRatio, setMaxInstanceVariantRatio],
		)

		const handleSlideChange = useCallback(
			(newRange: [number, number]) => {
				setLocalRange(newRange)
			},
			[setLocalRange],
		)

		const handleResetButtonClick = useCallback(() => {
			handleOnAfterChange([min, max])
		}, [min, max, handleOnAfterChange])

		const Handle = useMemo(() => {
			return SliderToolTip({
				theme: theme,
				alwaysShow: true,
				position: [SliderPosition.Bottom, SliderPosition.Top],
				formatter: (val: number) => hundreds(1 - val),
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
					{
						border: `2px solid ${theme.scales().nominal(10)(0).hex()}`,
					},
					{
						border: `2px solid ${theme.scales().nominal(10)(0).hex()}`,
					},
				],
				railStyle: {
					backgroundColor: theme.application().lowContrast().hex(),
				},
			}
		}, [theme])

		return (
			<Container>
				<IconButton
					iconProps={{ iconName: 'branchFork2' }}
					onClick={handleResetButtonClick}
					title="Reset to full variant range"
				/>
				<RangeContainer>
					<Range
						allowCross={false}
						value={localRange}
						min={min}
						max={max}
						step={0.01}
						reverse={true}
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

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Text } from '@fluentui/react'
import { Theme } from '@thematic/core'
import Slider, { Handle } from 'rc-slider'
import React from 'react'
import styled from 'styled-components'

export enum SliderPosition {
	Top = 'Top',
	Bottom = 'Bottom',
}

export interface SliderToolTipSettings {
	theme: Theme
	alwaysShow?: boolean
	position?: [SliderPosition, SliderPosition]
	formatter?: (val: number) => string
}

export const SliderToolTip = ({
	theme,
	alwaysShow = false,
	position = [SliderPosition.Top, SliderPosition.Top],
	formatter = v => v.toString(),
}: SliderToolTipSettings): React.FC<Slider.HandleProps> => {
	return function SliderToolTip({
		value,
		dragging,
		index,
		...rest
	}): JSX.Element {
		return (
			<FlexHandle key={index} value={value} {...rest}>
				{(alwaysShow || dragging) && (
					<Panel top={position[index] === SliderPosition.Top}>
						<Value variant="xSmall">{formatter(value)}</Value>
					</Panel>
				)}
			</FlexHandle>
		)
	}
}

const FlexHandle = styled(Handle)`
	display: flex;
	justify-content: center;
`

const Panel = styled.div<{ top?: boolean }>`
	margin-top: ${props => (props.top ? '-28px' : '10px')};
	white-space: nowrap;
	margin-bottom: ${props => (props.top ? '28px' : '-10px')};
`

const Value = styled(Text)``

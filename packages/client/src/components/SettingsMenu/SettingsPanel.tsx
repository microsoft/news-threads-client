/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ControlType, Settings } from '@essex-js-toolkit/themed-components'
import { Dataset } from '@newsthreads/schema/lib/client-types'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'

export interface SettingsPanelProps {
	datasets: Dataset[]
	settings: unknown
	onChange: (key: string, value: unknown) => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = memo(
	function SettingsPanel({ datasets, settings, onChange }) {
		const config = useMemo(
			() => ({
				dataset: {
					control: ControlType.dropdown,
					params: {
						options: datasets.map(d => d.label),
					},
				},
			}),
			[datasets],
		)
		return (
			<PanelContainer>
				<Settings
					settings={settings}
					onChange={onChange}
					config={config}
					groups={SETTINGS_PANEL_GROUPS}
				/>
			</PanelContainer>
		)
	},
)

const SETTINGS_PANEL_GROUPS = [
	{
		label: 'Appearance',
		keys: ['darkMode'],
	},
]

const PanelContainer = styled.div`
	padding: 8px;
`

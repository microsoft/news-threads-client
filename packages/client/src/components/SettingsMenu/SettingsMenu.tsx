/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, IIconProps } from '@fluentui/react'
import { Dataset } from '@newsthreads/schema/lib/client-types'
import { Theme } from '@thematic/core'
import React, { memo, useMemo, useCallback } from 'react'

import { SettingsPanel } from './SettingsPanel'

interface SettingsMenuProps {
	theme: Theme
	darkMode: boolean
	onDarkModeChanged: (darkMode: boolean) => void
	datasets: Dataset[]
	dataset?: Dataset
	onDatasetChanged: (name: string) => void
}

export const SettingsMenu: React.FC<SettingsMenuProps> = memo(
	function SettingsMenu({
		theme,
		darkMode,
		onDarkModeChanged,
		datasets,
		dataset,
		onDatasetChanged,
	}) {
		// we want the settings ui to show the friendly dataset label, but map back to the key for queries
		const settings = useMemo(
			() => ({
				darkMode,
				dataset: dataset?.label || '',
			}),
			[darkMode, dataset],
		)
		const handleSettingsChanged = useCallback(
			(key, value) => {
				let ds: Dataset | undefined
				switch (key) {
					case 'darkMode':
						onDarkModeChanged(value)
						break
					case 'dataset':
						ds = datasets.find(d => d.label === value)
						onDatasetChanged(ds ? ds.id : '')
						break
				}
			},
			[onDarkModeChanged, onDatasetChanged, datasets],
		)
		const menuProps = useMemo(
			() => ({
				// wire in the settings so why-did-you-render doesn't complain about object equality
				settings,
				styles: {
					root: { background: theme.application().background().hex() },
					container: { background: theme.application().background().hex() },
				},
				items: [
					{
						key: 'settings',
						onRender: function SettingsPanelContainer() {
							return (
								<SettingsPanel
									datasets={datasets}
									settings={settings}
									onChange={handleSettingsChanged}
								/>
							)
						},
					},
				],
			}),
			[settings, theme, handleSettingsChanged, datasets],
		)
		return (
			<IconButton split={false} iconProps={iconProps} menuProps={menuProps} />
		)
	},
)

const iconProps: IIconProps = { iconName: 'Settings' }

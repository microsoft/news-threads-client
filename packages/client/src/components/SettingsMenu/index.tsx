/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'
import {
	useDarkMode,
	useSelectedDatasetId,
	useDatasets,
	useSelectedDataset,
} from '../../hooks'
import { SettingsMenu as SettingsMenuComponent } from './SettingsMenu'

export const SettingsMenu: React.FC = memo(function SettingsMenu() {
	const theme = useThematic()
	const [darkMode, setDarkMode] = useDarkMode()
	const [datasets] = useDatasets()
	const [, setDataset] = useSelectedDatasetId()
	const selectedDataset = useSelectedDataset()

	return (
		<SettingsMenuComponent
			theme={theme}
			darkMode={darkMode}
			onDarkModeChanged={setDarkMode}
			dataset={selectedDataset}
			datasets={datasets}
			onDatasetChanged={setDataset}
		/>
	)
})

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { combineEpics } from 'redux-observable'
import { handleAppMounted } from './handleAppMounted'
import { persistThemeChanges } from './persistThemeChanges'
import { persistUrlState } from './persistUrlState'
import { resetStateOnDatasetChange } from './resetStateOnDatasetChange'

export const rootEpic = combineEpics(
	handleAppMounted,
	persistThemeChanges,
	resetStateOnDatasetChange,
	persistUrlState,
)

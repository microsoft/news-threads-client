/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PayloadAction } from '@reduxjs/toolkit'
import { ThemeVariant } from '@thematic/core'
import { Epic, ofType } from 'redux-observable'
import { mergeMap } from 'rxjs/operators'
import { setPreferredThemeVariant } from '../../resources/localStorage'
import { themeChanged } from '../slices'

export const persistThemeChanges: Epic = (action$, state$) =>
	action$.pipe(
		ofType(themeChanged.type),
		mergeMap((action: PayloadAction<ThemeVariant>) => {
			setPreferredThemeVariant(action.payload)
			return []
		}),
	)

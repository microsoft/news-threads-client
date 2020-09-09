/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { load, Theme, ThemeVariant } from '@thematic/core'
import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppState, themeChanged } from '../state'

export function useTheme(): Theme {
	const variant: ThemeVariant = useSelector(
		(state: AppState) => state.theme.variant,
	)
	return useMemo(() => load({ variant }), [variant])
}

export function useDarkMode(): [boolean, (darkMode: boolean) => void] {
	const dispatch = useDispatch()
	const getter = useSelector(
		(state: AppState) => state.theme.variant === ThemeVariant.Dark,
	)
	const setter = useCallback(
		(darkMode: boolean) => {
			dispatch(themeChanged(darkMode ? ThemeVariant.Dark : ThemeVariant.Light))
		},
		[dispatch],
	)
	return [getter, setter]
}

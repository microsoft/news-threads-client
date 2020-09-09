/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThemeVariant } from '@thematic/core'

/**
 * Gets the preferred color scheme for the user
 */
export function getSystemPreferredThemeVariant(): ThemeVariant {
	return getTheme(preferredColorSchemeQuery)
}

/**
 * Watch for changes in user preferences for color themes
 * @param onChange
 */
export function watchSystemPreferredThemeVariant(
	onChange: (theme: ThemeVariant) => void,
): () => void {
	const listener = (e: MediaQueryListEvent): void => onChange(getTheme(e))
	preferredColorSchemeQuery.addListener(listener)
	return (): void => preferredColorSchemeQuery.removeListener(listener)
}

const preferredColorSchemeQuery = window.matchMedia(
	'(prefers-color-scheme: dark)',
)

/**
 * Unpacks the preferred theme variant from a media query
 * @param ev The media query for dark theme preference
 */
const getTheme = (ev: MediaQueryList | MediaQueryListEvent): ThemeVariant =>
	ev.matches ? ThemeVariant.Dark : ThemeVariant.Light

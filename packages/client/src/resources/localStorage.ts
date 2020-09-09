/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThemeVariant } from '@thematic/core'

/**
 * Sets the preferred user color scheme
 * @param variant The preferred user color scheme
 */
export function setPreferredThemeVariant(variant: ThemeVariant): void {
	localStorage.preferredColorScheme = variant
}

/**
 * Gets the preferred user color scheme
 * @returns the preferred color scheme, or undefined
 */
export function getPreferredThemeVariant(): ThemeVariant | undefined {
	return localStorage.preferredColorScheme
}

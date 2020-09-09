/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'
import { DiffSide } from '../../state'

export function useDiffColor(side: DiffSide): string {
	const theme = useThematic()
	const nominal = theme.scales().nominal(10)
	if (side === DiffSide.Left) {
		return nominal(1).hex()
	} else {
		return nominal(2).hex()
	}
}

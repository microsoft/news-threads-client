/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import React, { memo, useMemo } from 'react'
export const Separator: React.FC = memo(function Separator() {
	const theme = useThematic()
	const style = useMemo(
		() => ({
			color: theme.application().midContrast().hex(),
		}),
		[theme],
	)
	return <span style={style}>&nbsp;|&nbsp;</span>
})

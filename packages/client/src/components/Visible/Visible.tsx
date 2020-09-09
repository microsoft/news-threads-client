/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import React, { memo } from 'react'

export interface VisibleProps {
	show: boolean
}

export const Visible: React.FC<VisibleProps> = memo(function Visible({
	show,
	children,
}) {
	if (!show) return null

	return <>{children}</>
})

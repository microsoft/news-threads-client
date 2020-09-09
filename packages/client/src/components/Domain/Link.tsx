/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import React, { memo } from 'react'

export interface LinkProps {
	url: string
}
export const Link: React.FC<LinkProps> = memo(function Link({ url }) {
	return (
		<a href={url} target="_blank" rel="noopener noreferrer">
			<Icon iconName="OpenInNewWindow" />
		</a>
	)
})

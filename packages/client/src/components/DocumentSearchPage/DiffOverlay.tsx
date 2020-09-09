/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Panel, PanelType } from '@fluentui/react'
import { useConstCallback } from '@uifabric/react-hooks'
import React, { memo, useEffect } from 'react'

import { useDiffId } from '../../hooks'
import { DiffSide } from '../../state'
import { DiffPanels } from '../DiffPanels'

export const DiffOverlay: React.FC = memo(function DiffOverlay() {
	const [leftId, setLeft] = useDiffId(DiffSide.Left)
	const [rightId, setRight] = useDiffId(DiffSide.Right)
	const [isOpen, setIsOpen] = React.useState(false)
	const openPanel = useConstCallback(() => setIsOpen(true))
	const dismissPanel = useConstCallback(() => {
		setIsOpen(false)
		setLeft(null)
		setRight(null)
	})
	useEffect(() => {
		if (leftId != null && rightId != null) {
			openPanel()
		}
	}, [leftId, rightId, openPanel])
	return (
		<Panel
			isOpen={isOpen}
			isLightDismiss={true}
			onDismiss={dismissPanel}
			closeButtonAriaLabel="Close"
			type={PanelType.extraLarge}
			styles={{ header: { marginTop: 0 } }}
		>
			<DiffPanels />
		</Panel>
	)
})

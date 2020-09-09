/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DocumentCluster } from '@newsthreads/schema/lib/client-types'
import React, { memo, useCallback, useMemo } from 'react'
import { Sparkbar } from '../Sparkbar'

interface ClusterBarProps {
	clusters: DocumentCluster[]
	width: number
	height: number
	selected?: DocumentCluster
	onSelectCluster?: (c: DocumentCluster) => void
}

export const ClusterBar: React.FC<ClusterBarProps> = memo(function ClusterBar({
	clusters,
	width,
	height,
	selected,
	onSelectCluster,
}) {
	const id = useCallback(d => `${d.clusterId}-${d.epsilon}`, [])
	const accessor = useCallback(d => d.documentCount, [])
	const nodata = useCallback(d => d.clusterId < 0, [])
	const handleSelect = useCallback(
		c => {
			if (onSelectCluster) {
				onSelectCluster(c)
			}
		},
		[onSelectCluster],
	)
	const sel = useCallback(d => d === selected, [selected])
	const sparkbarData = useMemo(() => [...clusters].reverse(), [clusters])
	return (
		<Sparkbar
			data={sparkbarData}
			width={width}
			height={height}
			id={id}
			value={accessor}
			nodata={nodata}
			selected={sel}
			onClick={handleSelect}
		/>
	)
})

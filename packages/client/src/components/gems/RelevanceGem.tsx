/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'
import { RadialScoreGem } from '../charts/RadialScoreGem'

export interface RelevanceGemProps {
	className?: string
	relevance?: number
	indicateNoData?: boolean
}
export const RelevanceGem: React.FC<RelevanceGemProps> = memo(
	function RelevanceGem({ relevance, className, indicateNoData = false }) {
		const theme = useThematic()
		const fill = theme.scales().nominal(10)(0).hex()
		const score = relevance || 0
		const noData = indicateNoData && !relevance
		return (
			<RadialScoreGem score={score} radius={6} fill={fill} noData={noData} />
		)
	},
)

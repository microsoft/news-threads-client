/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Domain } from '@newsthreads/schema/lib/client-types'
import React, { memo, useMemo } from 'react'
import { RadialScoreGem } from '../charts/RadialScoreGem'

export interface DomainGemProps {
	className?: string
	info: Domain | null
	radius?: number
	arcWidth?: number
	indicateNoData?: boolean
}

const DEFAULT_RADIUS = 6
const DEFAULT_ARC_WIDTH = 2

export const DomainGem: React.FC<DomainGemProps> = memo(function DomainGem({
	info,
	className,
	radius = DEFAULT_RADIUS,
	arcWidth = DEFAULT_ARC_WIDTH,
	indicateNoData,
}) {
	const score = useScore(info)
	const fill = useInfoColor(info)
	const isRendered = info != null || indicateNoData
	return !isRendered ? null : (
		<RadialScoreGem
			className={className}
			score={score}
			fill={fill}
			radius={radius}
			arcWidth={arcWidth}
			noData={indicateNoData && (info == null || info.score == null)}
		/>
	)
})

function useScore(info: Domain | null) {
	return useMemo(() => (info?.score || 0) / 100, [info])
}

function useInfoColor(info: Domain | null): string {
	return useMemo(() => {
		if (!info) {
			return 'transparent'
		}
		const rating = info.rating
		// these colors are harvested from the NewsGuard rating description
		// https://www.newsguardtech.com/ratings/rating-process-criteria/
		if (rating === 'Trustworthy') {
			return '#42B149'
		} else if (rating === 'NotTrustworthy') {
			return '#C92027'
		} else if (rating === 'Parody') {
			return '#FBB038'
		} else {
			return 'transparent'
		}
	}, [info])
}

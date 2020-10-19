/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import { Document } from '@newsthreads/schema/lib/client-types'
import { useThematic } from '@thematic/react'
import { format } from 'd3-format'
import { scaleLog } from 'd3-scale'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { useSelectedDatasetFeatures } from '../../hooks'
import { Visible } from '../Visible'
import { RadialScoreGem } from '../charts/RadialScoreGem'
import { RelevanceGem, DomainGem } from '../gems'

interface GemsProps {
	document: Document
	score?: number
}

const pretty = format('0.5f')
const scale = scaleLog()
	.range([0, Math.PI * 2])
	.domain([10e-6, 1])

export const DocumentGems: React.FC<GemsProps> = memo(function DocumentGems({
	document,
	score,
}) {
	const theme = useThematic()
	const datasetFeatures = useSelectedDatasetFeatures()
	const iconStyles = useMemo(
		() => ({
			root: {
				color: theme.application().midContrast().hex(),
				marginRight: 2,
				fontSize: 12,
				width: 12,
				height: 12,
			},
		}),
		[theme],
	)

	const [variation, duplication] = useMemo(() => {
		if (datasetFeatures.docstats) {
			const { instanceVariantRatio, instanceDuplicateRatio } = document.stats
			return [
				1 - instanceVariantRatio,
				// log can't cross zero
				1 - instanceDuplicateRatio === 0 ? 10e-6 : 1 - instanceDuplicateRatio,
			]
		} else {
			return [0, 0]
		}
	}, [document, datasetFeatures])

	const colorScale = theme.scales().nominal(10)
	return (
		<Container>
			<Group title={`Search relevance score: ${document.score}`}>
				<Icon iconName="Search" styles={iconStyles} />
				<RelevanceGem relevance={score} indicateNoData={true} />
			</Group>
			<Visible show={!!datasetFeatures.docstats}>
				<Group title={`Document content varation score: ${pretty(variation)}`}>
					<Icon iconName="BranchFork2" styles={iconStyles} />
					<RadialScoreGem
						score={variation}
						radius={6}
						fill={colorScale(1).hex()}
						scale={scale as (input: number) => number}
					/>
				</Group>
				<Group
					title={`Document content duplication score: ${pretty(duplication)}`}
				>
					<Icon iconName="DependencyAdd" styles={iconStyles} />
					<RadialScoreGem
						score={duplication}
						radius={6}
						fill={colorScale(2).hex()}
						scale={scale as (input: number) => number}
					/>
				</Group>
			</Visible>
			<Visible show={!!datasetFeatures.domains}>
				<Group title={`Domain quality score: ${document.domain.score}`}>
					<Icon iconName="Globe2" styles={iconStyles} />
					<DomainGem info={document.domain} indicateNoData={true} />
				</Group>
			</Visible>
		</Container>
	)
})

const Container = styled.div`
	margin-left: 8px;
	margin-bottom: 4px;
	display: flex;
`

const Group = styled.div`
	display: flex;
	margin-right: 12px;
`

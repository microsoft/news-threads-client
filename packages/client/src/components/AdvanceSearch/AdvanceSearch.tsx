/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'

import { useSelectedDatasetFeatures } from '../../hooks'
import { DateRangeSlider } from '../DateRangeSlider'
import { DomainScoreSlider } from '../DomainScoreSlider'
import { DuplicationSlider } from '../DuplicationSlider'
import { VariationSlider } from '../VariationSlider'
import { Visible } from '../Visible'
import { SiteSearch } from './SiteSearch'

export const AdvanceSearch: React.FC = memo(function AdvanceSearch() {
	const datasetFeatures = useSelectedDatasetFeatures()
	return (
		<Container>
			<Section>
				<SiteSearch />
			</Section>
			<Section>
				<DateRangeSlider showMarks={false} />
			</Section>
			<Visible show={!!datasetFeatures.domains}>
				<Section>
					<DomainScoreSlider showMarks={false} />
				</Section>
			</Visible>
			<Visible show={!!datasetFeatures.docstats}>
				<Section>
					<VariationSlider showMarks={false} />
				</Section>
				<Section marginRight={0}>
					<DuplicationSlider showMarks={false} />
				</Section>
			</Visible>
		</Container>
	)
})

const Container = styled.div`
	margin-top: 5px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
`

const Section = styled.div<{ marginRight?: number }>`
	flex: 1;
	margin-right: ${props => (props.marginRight ?? 20) + 'px'};
`

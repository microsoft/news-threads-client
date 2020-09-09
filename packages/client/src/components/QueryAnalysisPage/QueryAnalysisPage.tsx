/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dataset } from '@newsthreads/schema/lib/client-types'
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import moment from 'moment'
import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSelectedDataset, useQueries, useRemoveQuery } from '../../hooks'
import { Actions, Layout, Sort } from './Actions'
import { VolumeChartPair } from './VolumeChartPair'

const CHART_WIDTH = 400
const CHART_HEIGHT = 24
const BAR_GAP = 1

export const QueryAnalysisPage: React.FC = memo(function QueryAnalysisPage() {
	const theme = useThematic()
	const selectedDataset = useSelectedDataset()
	const queries = useQueries()
	const removeQuery = useRemoveQuery()

	const [layout, setLayout] = useState<Layout>(Layout.Grid)
	const [sort, setSort] = useState<Sort>(Sort.Default)

	const ordered = useMemo(
		() => (sort === Sort.Default ? queries : [...queries].sort()),
		[sort, queries],
	)
	const dateRange = useDateRange(selectedDataset)
	const barWidth = useMemo(() => {
		if (dateRange && CHART_WIDTH) {
			const start = moment.utc(dateRange[0])
			const stop = moment.utc(dateRange[1])
			const delta = stop.diff(start, 'days')
			return (CHART_WIDTH - delta * BAR_GAP) / delta
		}
		return 4
	}, [dateRange])
	const handleRemoveQuery = useCallback((text: string) => removeQuery(text), [
		removeQuery,
	])
	return (
		<Container>
			<Actions
				width={CHART_WIDTH}
				onLayoutChange={setLayout}
				onSortChange={setSort}
				layout={layout}
				sort={sort}
			/>
			<PageContainer theme={theme}>
				<ChartsContainer layout={layout}>
					<PairContainer key={`chart-pair-everything`} layout={layout}>
						<VolumeChartPair
							text={'__documents__'}
							title={'(everything)'}
							chartWidth={CHART_WIDTH}
							chartHeight={CHART_HEIGHT}
							barWidth={barWidth}
							dateRange={dateRange}
						/>
					</PairContainer>
					{ordered.map(query => {
						return (
							<PairContainer key={`chart-pair-${query}`} layout={layout}>
								<VolumeChartPair
									text={query}
									chartWidth={CHART_WIDTH}
									chartHeight={CHART_HEIGHT}
									barWidth={barWidth}
									dateRange={dateRange}
									onClose={handleRemoveQuery}
								/>
							</PairContainer>
						)
					})}
				</ChartsContainer>
			</PageContainer>
		</Container>
	)
})

const Container = styled.div`
	flex: 1;
	height: 100%;
	margin-top: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow-y: hidden;
`

const PageContainer = styled.div<{ theme: Theme }>`
	margin-top: 20px;
	width: 100%;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-style: solid;
	border-width: 1px 0;
	border-color: ${props => props.theme.application().lowContrast()};
`

const ChartsContainer = styled.div<{ layout?: Layout }>`
	width: ${props =>
		props.layout === Layout.SingleColumn ? `${CHART_WIDTH}px` : '100%'};
	margin-top: 10px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
`

const PairContainer = styled.div<{ layout?: Layout }>`
	margin: ${props => (props.layout === Layout.SingleColumn ? '10px' : '20px')};
`

function useDateRange(dataset: Dataset | undefined): [Date, Date] | undefined {
	return useMemo<[Date, Date] | undefined>(() => {
		if (dataset && dataset.startDate != null && dataset.endDate != null) {
			return [new Date(dataset.startDate), new Date(dataset.endDate)]
		}
		return undefined
	}, [dataset])
}

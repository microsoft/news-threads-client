/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDimensions } from '@essex-js-toolkit/hooks'
import { Dataset } from '@newsthreads/schema/lib/client-types'
import { Theme } from '@thematic/core/lib/Theme'
import { useThematic } from '@thematic/react'
import moment from 'moment'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components'
import {
	useSelectedDataset,
	useSelectedDatasetFeatures,
	useSearch,
	useSelectedDocument,
} from '../../hooks'
import { Visible } from '../Visible'
import { TimeBrush } from '../charts/TimeBrush'
import { QueryTokenDailyBars } from './QueryTokenDailyBars'
import { SearchTermDailyBars } from './SearchTermDailyBars'

const DOCUMENT_MAGIC = '__documents__'
const CHART_WIDTH = 800
const BAR_GAP = 1

export const DailySparklinesStack: React.FC = memo(
	function DailySparklinesStack() {
		const ref = useRef(null)
		const dimensions = useDimensions(ref)
		const chartWidth = dimensions?.width || CHART_WIDTH
		const theme = useThematic()
		const [query] = useSearch<string>('query')
		const [from, setFrom] = useSearch<string>('from')
		const [to, setTo] = useSearch<string>('to')
		const [selectedDocument] = useSelectedDocument()
		const markedDate = useMarkedDate(selectedDocument)
		const selectedDataset = useSelectedDataset()
		const dateRange = useDateRange(selectedDataset)

		const barWidth = useMemo(() => {
			if (dateRange && chartWidth) {
				const start = moment.utc(dateRange[0])
				const stop = moment.utc(dateRange[1])
				const delta = stop.diff(start, 'days')
				return (chartWidth - delta * BAR_GAP) / delta
			}
			return 4
		}, [chartWidth, dateRange])

		const selectionRange: [Date, Date] | undefined = useMemo(() => {
			if (from && to) {
				return [new Date(from), new Date(to)]
			}
		}, [from, to])

		const handleBrushEnd = useCallback(
			(range: [Date, Date] | null) => {
				setFrom(range?.[0]?.toISOString() ?? '')
				setTo(range?.[1]?.toISOString() ?? '')
			},
			[setFrom, setTo],
		)
		const features = useSelectedDatasetFeatures()
		const { dailyTermCounts, dailyQueryCounts } = features

		return (
			<Container ref={ref}>
				<Visible show={!!query && !!dailyTermCounts}>
					<TermBarContainer>
						<VolumeLabel theme={theme}>
							Daily articles mentioning &apos;
							<QueryLabel theme={theme}>{query}</QueryLabel>&apos;
						</VolumeLabel>
						<SearchTermDailyBars
							search={query}
							width={chartWidth}
							height={24}
							barWidth={barWidth}
							dateRange={dateRange}
							selectionRange={selectionRange}
							markedDate={markedDate}
						/>
					</TermBarContainer>
				</Visible>
				<Visible show={!!query && !!dailyQueryCounts}>
					<TermBarContainer>
						<VolumeLabel theme={theme}>
							Daily user searches containing &apos;
							<QueryLabel theme={theme}>{query}</QueryLabel>&apos;
						</VolumeLabel>
						<QueryTokenDailyBars
							token={query}
							width={chartWidth}
							height={24}
							barWidth={barWidth}
							dateRange={dateRange}
							selectionRange={selectionRange}
							markedDate={markedDate}
						/>
					</TermBarContainer>
				</Visible>
				<Visible show={!!dailyTermCounts}>
					<TermBarContainer>
						<VolumeLabel theme={theme}>Total daily article volume</VolumeLabel>
						<SearchTermDailyBars
							search={DOCUMENT_MAGIC}
							width={chartWidth}
							height={32}
							barWidth={barWidth}
							dateRange={dateRange}
							selectionRange={selectionRange}
							markedDate={markedDate}
						/>
					</TermBarContainer>
				</Visible>
				<Visible show={!!dailyTermCounts || !!dailyQueryCounts}>
					{dateRange ? (
						<TermBarContainer>
							<TimeBrush
								dateRange={dateRange}
								brushRange={selectionRange}
								width={chartWidth}
								height={18}
								barWidth={barWidth}
								onBrushEnd={handleBrushEnd}
								roundToDay={true}
							/>
						</TermBarContainer>
					) : null}
				</Visible>
			</Container>
		)
	},
)

const Container = styled.div`
	width: 100%;
`

const TermBarContainer = styled.div`
	margin-bottom: 2px;
`

const VolumeLabel = styled.div<{ theme: Theme }>`
	font-size: 10px;
	color: ${props => props.theme.application().midContrast().hex()};
`

const QueryLabel = styled.span<{ theme: Theme }>`
	color: ${props => props.theme.application().accent().hex()};
`

function useMarkedDate(doc) {
	return useMemo(() => {
		if (doc) {
			return new Date(doc.date)
		}
	}, [doc])
}
function useDateRange(dataset: Dataset | undefined): [Date, Date] | undefined {
	return useMemo<[Date, Date] | undefined>(() => {
		if (dataset && dataset.startDate != null && dataset.endDate != null) {
			return [new Date(dataset.startDate), new Date(dataset.endDate)]
		}
		return undefined
	}, [dataset])
}

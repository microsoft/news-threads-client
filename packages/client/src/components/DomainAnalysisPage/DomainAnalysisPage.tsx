/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Spinner,
	IColumn,
	DetailsList,
	SelectionMode,
	mergeStyleSets,
	SearchBox,
} from '@fluentui/react'
import {
	DomainStatsSortBy,
	DomainStats,
} from '@newsthreads/schema/lib/client-types'
import { useThematic } from '@thematic/react'
import { format } from 'd3-format'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import {
	useDomainStats,
	useDomainAnalysisSort,
	useDomainQuery,
} from '../../hooks'
import { DomainAnalysisSort } from '../../state'
import { Visible } from '../Visible'

const thousands = format('.3f')

export const DomainAnalysisPage: React.FC = memo(function DomainAnalysisPage() {
	const theme = useThematic()
	const [sort, setSort] = useDomainAnalysisSort()
	const [domains, loading] = useDomainStats()
	const [domainQuery, setDomainQuery] = useDomainQuery()
	const handleSearch = useCallback((query: string) => setDomainQuery(query), [
		setDomainQuery,
	])
	// TEMP: until we get normalized and correctly inverted values for variation,
	// we want to display the sort OPPOSITE for that case
	// this is ONLY for display, and will be reversed to normal when setting state
	// in the column click handler
	const correctedSort = useMemo(() => {
		if (
			sort.by === 'InstanceVariantRatio' ||
			sort.by === 'InstanceDuplicateRatio'
		) {
			return {
				by: sort.by,
				direction: sort.direction === 'Ascending' ? 'Descending' : 'Ascending',
			} as DomainAnalysisSort
		}
		return sort
	}, [sort])

	const handleColumnClick = useCallback(
		(ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
			let by = column.name // most match the sort param
			let descending = !column.isSortedDescending
			if (column.fieldName === 'instanceVariantRatio') {
				by = 'InstanceVariantRatio'
				descending = !descending
			} else if (column.fieldName === 'instanceDuplicateRatio') {
				by = 'InstanceDuplicateRatio'
				descending = !descending
			}
			setSort({
				by: by as DomainStatsSortBy,
				direction: descending ? 'Descending' : 'Ascending',
			})
		},
		[setSort],
	)
	/** end temp inversion fixes */

	// KLUDGE: the fabric default is the "secondary" theme color for some reason,
	// and they don't provide the usual style props to get to the cell easily
	const classNames = useMemo(
		() =>
			mergeStyleSets({
				columnDefault: {
					color: theme.application().foreground().hex(),
				},
			}),
		[theme],
	)

	const renderVariation = useCallback(
		(item?: DomainStats, index?: number, column?: IColumn) => {
			const raw = item ? (item[column?.fieldName ?? ''] as number) ?? 0 : 0
			const invert = 1 - raw
			return (
				<span style={{ color: theme.application().foreground().hex() }}>
					{thousands(invert)}
				</span>
			)
		},
		[theme],
	)
	const renderDuplication = useCallback(
		(item?: DomainStats, index?: number, column?: IColumn) => {
			const raw = item ? (item[column?.fieldName ?? ''] as number) ?? 0 : 0
			const invert = 1 - raw
			return (
				<span style={{ color: theme.application().foreground().hex() }}>
					{thousands(invert)}
				</span>
			)
		},
		[theme],
	)

	const columns: IColumn[] = useMemo(
		() => [
			{
				key: 'domain',
				name: 'Domain',
				fieldName: 'domain',
				className: classNames.columnDefault,
				minWidth: 200,
				isSorted: correctedSort.by === 'Domain',
				isSortedDescending: correctedSort.direction === 'Descending',
				onColumnClick: handleColumnClick,
			},
			{
				key: 'score',
				name: 'Score',
				fieldName: 'score',
				className: classNames.columnDefault,
				minWidth: 60,
				maxWidth: 60,
				isSorted: correctedSort.by === 'Score',
				isSortedDescending: correctedSort.direction === 'Descending',
				onColumnClick: handleColumnClick,
			},
			{
				key: 'rating',
				name: 'Rating',
				fieldName: 'rating',
				className: classNames.columnDefault,
				minWidth: 140,
				isSorted: correctedSort.by === 'Rating',
				isSortedDescending: correctedSort.direction === 'Descending',
				onColumnClick: handleColumnClick,
			},
			{
				key: 'documents',
				name: 'Documents',
				fieldName: 'documents',
				className: classNames.columnDefault,
				minWidth: 140,
				isSorted: correctedSort.by === 'Documents',
				isSortedDescending: correctedSort.direction === 'Descending',
				onColumnClick: handleColumnClick,
			},
			{
				key: 'variation',
				name: 'Variation',
				fieldName: 'instanceVariantRatio',
				className: classNames.columnDefault,
				minWidth: 100,
				onRender: renderVariation,
				isSorted: correctedSort.by === 'InstanceVariantRatio',
				isSortedDescending: correctedSort.direction === 'Descending',
				onColumnClick: handleColumnClick,
			},
			{
				key: 'duplication',
				name: 'Duplication',
				fieldName: 'instanceDuplicateRatio',
				className: classNames.columnDefault,
				minWidth: 100,
				onRender: renderDuplication,
				isSorted: correctedSort.by === 'InstanceDuplicateRatio',
				isSortedDescending: correctedSort.direction === 'Descending',
				onColumnClick: handleColumnClick,
			},
		],
		[
			renderVariation,
			renderDuplication,
			handleColumnClick,
			correctedSort,
			classNames,
		],
	)
	return (
		<Container>
			<Space />
			<Search>
				<SearchBox
					placeholder="Filter domains"
					onSearch={handleSearch}
					value={domainQuery}
				/>
			</Search>
			<Visible show={loading}>
				<Spinner />
			</Visible>
			<Visible show={!loading}>
				<PageContainer>
					<DetailsListContainer>
						<DetailsList
							items={domains}
							columns={columns}
							selectionMode={SelectionMode.none}
						/>
					</DetailsListContainer>
				</PageContainer>
			</Visible>
		</Container>
	)
})

const Container = styled.div`
	flex: 1;
	height: 100%;
	overflow-y: scroll;
`

const Space = styled.div`
	flex: 1 1 30px;
	min-height: 30px;
`

const Search = styled.div`
	margin-bottom: 10px;
`

const PageContainer = styled.div`
	width: 100%;
`

const DetailsListContainer = styled.div`
	max-width: 1200px;
`

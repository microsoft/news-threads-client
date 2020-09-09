/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner, SearchBox } from '@fluentui/react'
import {
	SentenceClusterSortBy,
	SortDirection,
} from '@newsthreads/schema/lib/client-types'
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import {
	useContentAnalysisSort,
	useSentenceClusters,
	useSentenceQuery,
} from '../../hooks'
import { Sort } from '../Sort'
import { Visible } from '../Visible'
import { ClusterRow } from './ClusterRow'

const sortByOptions1: string[] = ['Instances', 'Duplicates', 'Variants']
const sortByOptions2: string[] = [
	'InstanceVariantRatio',
	'InstanceDuplicateRatio',
]
const sortDirectionOptions: string[] = ['Ascending', 'Descending']

export const ContentAnalysisPage: React.FC = memo(
	function ContentAnalysisPage() {
		const theme = useThematic()
		const [sort, setSort] = useContentAnalysisSort()
		const [sentenceClusters, loading] = useSentenceClusters()
		const [sentenceQuery, setSentenceQuery] = useSentenceQuery()

		const handleSortByChanged = useCallback(
			(sortBy: string) =>
				setSort({
					by: sortBy as SentenceClusterSortBy,
				}),
			[setSort],
		)
		const handleDirectionChanged = useCallback(
			(sortDirection: string) =>
				setSort({
					direction: sortDirection as SortDirection,
				}),
			[setSort],
		)
		const handleSearch = useCallback(
			(query: string) => setSentenceQuery(query),
			[setSentenceQuery],
		)

		return (
			<Container>
				<Search>
					<SearchBox
						placeholder="Find content"
						onSearch={handleSearch}
						value={sentenceQuery}
					/>
				</Search>
				<H2 theme={theme}>Most Copied Sentences</H2>
				<StyledSortHeader>
					Sort:&nbsp;
					<Sort
						currentSortOption={sort.by}
						sortOptions={sortByOptions1}
						onSortChange={handleSortByChanged}
					/>
					<FixedWidthDiv />
					<Sort
						currentSortOption={sort.by}
						sortOptions={sortByOptions2}
						onSortChange={handleSortByChanged}
					/>
					<FixedWidthDiv />
					Direction:&nbsp;
					<Sort
						currentSortOption={sort.direction}
						sortOptions={sortDirectionOptions}
						onSortChange={handleDirectionChanged}
					/>
				</StyledSortHeader>
				<Visible show={loading}>
					<Spinner />
				</Visible>
				<Visible show={!loading}>
					<ClusterRowContainer theme={theme}>
						{sentenceClusters.map(cluster => (
							<ClusterRow
								cluster={cluster}
								key={`sentence-cluster-${cluster.clusterId}`}
							/>
						))}
					</ClusterRowContainer>
				</Visible>
			</Container>
		)
	},
)

const Container = styled.div`
	flex: 1;
	height: 100%;
	margin-top: 30px;
	display: flex;
	flex-direction: column;
	overflow-y: hidden;
`

const Search = styled.div`
	margin-bottom: 10px;
`

const H2 = styled.h2<{ theme: Theme }>`
	font-weight: 900;
	text-transform: uppercase;
	color: ${props => props.theme.application().lowContrast()};
`

const StyledSortHeader = styled.div`
	font-size: 0.7em;
	display: flex;
	align-items: center;
	margin-bottom: 20px;
`
const FixedWidthDiv = styled.div`
	width: 30px;
`

const ClusterRowContainer = styled.div<{ theme: Theme }>`
	overflow-y: scroll;
	border-style: solid;
	border-width: 1px 0;
	border-color: ${props => props.theme.application().lowContrast()};
`

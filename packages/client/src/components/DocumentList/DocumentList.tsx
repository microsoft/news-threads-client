/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Document } from '@newsthreads/schema/lib/client-types'
import { Theme } from '@thematic/core/lib/Theme'
import { useThematic } from '@thematic/react'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useDocumentSort, useDocumentSortOptions } from '../../hooks'
import { DocumentSortBy, DocumentSortDirection } from '../../state'
import { longNumber } from '../../util/format'
import { DocumentPagination } from '../DocumentPagination'
import { Sort } from '../Sort'
import { Card } from './DocumentListCard'

interface DocumentListProps {
	documents: Document[]
	selected: Document | null
	onSelect: (docid: string) => void
	total?: number
}

export const DocumentList: React.FC<DocumentListProps> = memo(
	function DocumentList({ documents, selected, onSelect, total }) {
		const theme = useThematic()
		const sortByOptions = useDocumentSortOptions()
		const [sort, setSort] = useDocumentSort()

		const handleSortChange = useCallback(
			(sortBy: string) => {
				setSort({
					by: sortBy as DocumentSortBy,
					direction:
						sort.direction === DocumentSortDirection.Descending
							? DocumentSortDirection.Ascending
							: DocumentSortDirection.Descending,
				})
			},
			[setSort, sort.direction],
		)

		const range = useMemo(() => {
			return documents.reduce(
				(acc, cur) => {
					return [
						Math.min(acc[0], cur.score || 0),
						Math.max(acc[1], cur.score || 0),
					]
				},
				[Number.MAX_VALUE, Number.MIN_VALUE],
			)
		}, [documents])

		return (
			<>
				<Header>
					<DocumentCount theme={theme}>
						{total ? (
							<>
								Showing {documents.length} of {longNumber(total)} results
							</>
						) : null}
					</DocumentCount>
					<StyledSort
						currentSortOption={sort.by}
						sortOptions={sortByOptions}
						onSortChange={handleSortChange}
						showSortIcon={true}
						iconDirection={
							sort.direction === DocumentSortDirection.Descending ? -1 : 1
						}
					/>
				</Header>
				<Documents theme={theme}>
					{documents.map(document => (
						<Card
							key={`document-card-${document.docid}`}
							document={document}
							selected={selected}
							score={
								document.score == null ? undefined : document.score / range[1]
							}
							onClick={onSelect}
						/>
					))}
				</Documents>
				<DocumentPagination />
			</>
		)
	},
)

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	line-height: 24px;
	text-baseline: bottom;
	font-size: 0.7em;
`

const Documents = styled.div<{ theme: Theme }>`
	flex: 2;
	border-width: 1px 0px 1px 0px;
	border-style: solid;
	border-color: ${props => props.theme.application().lowContrast()};
	overflow-y: scroll;
	// Need vertical scrolling for document search results
	// but do not display the scrollbar.
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		display: none;
	}
	scrollbar-width: none;
`

const DocumentCount = styled.div<{ theme: Theme }>`
	color: ${props => props.theme.application().midContrast().hex()};
`

const StyledSort = styled(Sort)`
	margin-right: 8px;
`

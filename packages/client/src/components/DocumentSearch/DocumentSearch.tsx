/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SearchBox, IconButton } from '@fluentui/react'
import { loadFluentTheme } from '@thematic/fluent'
import { useThematic } from '@thematic/react'
import React, { memo, useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useSearch, useAddQuery, useDocumentSort } from '../../hooks'
import { DocumentSortBy, DocumentSortDirection } from '../../state'
import { AdvanceSearch } from '../AdvanceSearch'
import { Visible } from '../Visible'

export const DocumentSearch: React.FC = memo(function DocumentSearch() {
	const theme = useThematic()
	const fluentTheme = useMemo(() => loadFluentTheme(theme), [theme])
	const [showAdvanceArea, setShowAdvanceArea] = useState(false)
	const [searchQuery, setSearchQuery] = useSearch<string>('query')
	const [, setDocumentSort] = useDocumentSort()
	const addQuery = useAddQuery()

	const handleSearch = useCallback(
		(text: string) => {
			setSearchQuery(text)
			// Set document sort to Score Desc when searching by query
			setDocumentSort({
				by: DocumentSortBy.Score,
				direction: DocumentSortDirection.Descending,
			})
			// store the query so it shows up as history in the query analysis
			// at some point we may want a higher-level epic to represent search business logic app-wide
			addQuery(text)
		},
		[setSearchQuery, addQuery, setDocumentSort],
	)
	const handleToggle = useCallback(() => {
		setShowAdvanceArea(!showAdvanceArea)
	}, [showAdvanceArea])

	const iconProps = useMemo(
		() => ({
			iconName: showAdvanceArea ? 'FilterSolid' : 'Filter',
		}),
		[showAdvanceArea],
	)

	const searchStyles = useMemo(() => {
		return {
			root: { flex: 1, borderRight: 'none', borderRadius: '2px 0 0 2px' },
		}
	}, [])
	const iconStyles = useMemo(() => {
		return {
			root: {
				border: `1px solid ${
					fluentTheme.toFluent().semanticColors.inputBorder
				}`,
				borderRadius: '0 2px 2px 0',
			},
		}
	}, [fluentTheme])
	return (
		<Container>
			<FlexContainer>
				<SearchBox
					styles={searchStyles}
					placeholder="Search for a document"
					value={searchQuery}
					onSearch={handleSearch}
				/>
				<StyledIconButton
					iconProps={iconProps}
					styles={iconStyles}
					onClick={handleToggle}
				/>
			</FlexContainer>
			<Visible show={showAdvanceArea}>
				<AdvanceSearch />
			</Visible>
		</Container>
	)
})

const Container = styled.div`
	margin-bottom: 10px;
`

const StyledIconButton = styled(IconButton)`
	margin: 0;
`

const FlexContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`

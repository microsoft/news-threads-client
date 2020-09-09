/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SearchBox, Link, IconButton } from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { useAddQuery, useResetQueries, useClearQueries } from '../../hooks'
import { Separator } from '../Separator'

export enum Layout {
	Grid,
	SingleColumn,
}

export enum Sort {
	Alpha,
	Default,
}

const ICON_SIZE = 12
const ICON_STYLES = { root: { width: ICON_SIZE, height: ICON_SIZE, margin: 1 } }
const GRID_ICON_PROPS = {
	iconName: 'Waffle',
}
const COLUMN_ICON_PROPS = {
	iconName: 'CheckListText',
}
const SORT_DEFAULT_ICON_PROPS = {
	iconName: 'SortLines',
}
const SORT_ALPHA_ICON_PROPS = {
	iconName: 'HalfAlpha',
}

export interface ActionsProps {
	width?: number
	layout?: Layout
	sort?: Sort
	onLayoutChange?: (newLayout: Layout) => void
	onSortChange?: (newSort: Sort) => void
}

export const Actions: React.FC<ActionsProps> = memo(function Actions({
	width = 400,
	layout = Layout.Grid,
	sort = Sort.Default,
	onLayoutChange,
	onSortChange,
}) {
	const addQuery = useAddQuery()
	const resetQueries = useResetQueries()
	const clearQueries = useClearQueries()

	const handleAddQuery = useCallback((text: string) => addQuery(text), [
		addQuery,
	])
	const handleResetQueries = useCallback(() => resetQueries(), [resetQueries])
	const handleClearQueries = useCallback(() => clearQueries(), [clearQueries])
	const handleGridClick = useCallback(() => {
		if (onLayoutChange) {
			onLayoutChange(Layout.Grid)
		}
	}, [onLayoutChange])
	const handleColumnClick = useCallback(() => {
		if (onLayoutChange) {
			onLayoutChange(Layout.SingleColumn)
		}
	}, [onLayoutChange])
	const handleSortDefaultClick = useCallback(() => {
		if (onSortChange) {
			onSortChange(Sort.Default)
		}
	}, [onSortChange])
	const handleSortAlphaClick = useCallback(() => {
		if (onSortChange) {
			onSortChange(Sort.Alpha)
		}
	}, [onSortChange])
	console.log(sort)
	return (
		<Container width={width}>
			<SearchBox placeholder="Add a term" onSearch={handleAddQuery} />
			<ActionLayout>
				<ActionLinks>
					<IconButton
						title="Grid layout"
						checked={layout === Layout.Grid}
						styles={ICON_STYLES}
						iconProps={GRID_ICON_PROPS}
						onClick={handleGridClick}
					/>
					<IconButton
						title="Single column layout"
						checked={layout === Layout.SingleColumn}
						styles={ICON_STYLES}
						iconProps={COLUMN_ICON_PROPS}
						onClick={handleColumnClick}
					/>
				</ActionLinks>
				<ActionLinks>
					<Link onClick={handleClearQueries}>clear all</Link>
					<Separator />
					<Link onClick={handleResetQueries}>reset defaults</Link>
				</ActionLinks>
				<ActionLinks>
					<IconButton
						title="Sort default"
						checked={sort === Sort.Default}
						styles={ICON_STYLES}
						iconProps={SORT_DEFAULT_ICON_PROPS}
						onClick={handleSortDefaultClick}
					/>
					<IconButton
						title="Sort alphabetically"
						checked={sort === Sort.Alpha}
						styles={ICON_STYLES}
						iconProps={SORT_ALPHA_ICON_PROPS}
						onClick={handleSortAlphaClick}
					/>
				</ActionLinks>
			</ActionLayout>
		</Container>
	)
})

const Container = styled.div<{ width: number }>`
	width: ${props => props.width}px;
`
const ActionLayout = styled.div`
	display: flex;
	justify-content: space-between;
`
const ActionLinks = styled.div`
	font-size: 0.7em;
	display: flex;
	justify-content: center;
	margin-top: 4px;
`

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot, PivotItem, PivotLinkFormat } from '@fluentui/react'
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo, useCallback, useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useSelectedDatasetFeatures } from '../../hooks'
import { Pages } from '../App'
import { SettingsMenu } from '../SettingsMenu'

export const AppHeader: React.FC = memo(function AppHeader() {
	const theme = useThematic()
	const handlePivot = usePivotItemSelectedHandler()
	const currentPath = useCurrentPath()
	const datasetFeatures = useSelectedDatasetFeatures()

	const borderRadiusStyles = useMemo(() => {
		return {
			borderTopLeftRadius: '2px',
			borderTopRightRadius: '2px',
		}
	}, [])

	const hoverLinkStyles = useMemo(() => {
		return {
			color: theme.application().highContrast().hex(),
			background: theme.application().faint().hex(),
			border: `1px solid ${theme.application().lowContrast().hex()}`,
			...borderRadiusStyles,
		}
	}, [theme, borderRadiusStyles])

	const activeLinkStyles = useMemo(() => {
		return {
			background: theme.application().background().hex(),
			borderBottom: `1px solid ${theme.application().background().hex()}`,
		}
	}, [theme])

	const linkStyles = useMemo(() => {
		return {
			link: {
				color: theme.application().highContrast().hex(),
				background: theme.application().faint().hex(),
				border: `1px solid transparent`,
				borderBottom: `1px solid ${theme.application().lowContrast().hex()}`,
				selectors: {
					':hover': hoverLinkStyles,
					':active': {
						...hoverLinkStyles,
						...activeLinkStyles,
					},
				},
			},
			linkIsSelected: {
				color: theme.application().highContrast().hex(),
				background: theme.application().background().hex(),
				border: `1px solid ${theme.application().lowContrast().hex()}`,
				...borderRadiusStyles,
				borderBottom: 0,
				selectors: {
					':hover': {
						...hoverLinkStyles,
						...activeLinkStyles,
					},
					':active': {
						...hoverLinkStyles,
						...activeLinkStyles,
					},
				},
			},
		}
	}, [theme, hoverLinkStyles, activeLinkStyles, borderRadiusStyles])

	return (
		<Container theme={theme}>
			<Title>
				<h1>News Threads</h1>
			</Title>
			<TabContainer>
				<Pivot
					selectedKey={currentPath}
					onLinkClick={handlePivot}
					headersOnly={true}
					linkFormat={PivotLinkFormat.tabs}
					styles={linkStyles}
				>
					<PivotItem
						headerText="Article search"
						itemKey={Pages.DocumentSearch}
					/>
					{datasetFeatures.sentenceAnalysis && (
						<PivotItem
							headerText="Content analysis"
							itemKey={Pages.ContentAnalysis}
						/>
					)}
					{datasetFeatures.domains && (
						<PivotItem headerText="Domains" itemKey={Pages.DomainAnalysis} />
					)}
					{datasetFeatures.dailyQueryCounts && (
						<PivotItem headerText="Queries" itemKey={Pages.QueryAnalysis} />
					)}
				</Pivot>
			</TabContainer>
			<SettingsContainer>
				<SettingsMenu />
			</SettingsContainer>
		</Container>
	)
})

function useCurrentPath(): string {
	const location = useLocation()
	return location.pathname || '/document-search'
}

function usePivotItemSelectedHandler(): (item?: PivotItem) => void {
	const history = useHistory()
	return useCallback(
		(item?: PivotItem) => {
			if (item) {
				history.push(item.props.itemKey || '/')
			}
		},
		[history],
	)
}

const TabContainer = styled.div`
	align-self: flex-end;
	margin-bottom: -1px;
`

const Container = styled.div<{ theme: Theme }>`
	background: ${props => props.theme.application().faint().hex()};
	border-bottom: 1px solid
		${props => props.theme.application().lowContrast().hex()};
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const Title = styled.div`
	margin-left: 20px;
	font-family: monospace;
`
const SettingsContainer = styled.div``

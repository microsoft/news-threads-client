/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { SentenceCluster } from '@newsthreads/schema/lib/client-types'
import { useThematic } from '@thematic/react'
import { format } from 'd3-format'
import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSentenceInstances, useSentenceQuery } from '../../hooks'
import { plural } from '../../util/format'
import { HighlightedText } from '../HighlightedText'
import { Separator } from '../Separator'
import { TextList } from '../charts/TextList'

interface ClusterRowProps {
	cluster: SentenceCluster
}

const prettyNumber = format(',')

export const ClusterRow: React.FC<ClusterRowProps> = memo(function ClusterRow({
	cluster,
}) {
	const theme = useThematic()
	const color = useMemo(() => theme.application().midContrast().hex(), [theme])
	const [query] = useSentenceQuery()
	const [expanded, setExpanded] = useState<boolean>(false)
	const [variants] = useSentenceInstances(cluster.sourceId, !expanded, true)
	const handleExpandClick = useCallback(() => setExpanded(!expanded), [
		expanded,
	])
	const lines = useMemo(() => variants.map(v => v.text), [variants])
	return (
		<MarginDiv margin="10px 0 0 0">
			<Sentence>
				<HighlightedText
					text={cluster.sourceSentenceText || ''}
					highlight={query}
				/>
			</Sentence>
			<ColorDiv color={color}>
				<IconButton
					title="Expand sentence instances"
					iconProps={expandIconButtonProps}
					onClick={handleExpandClick}
				/>
				<MarginDiv>{prettyNumber(cluster.instanceCount)} instances</MarginDiv>
				<MarginDiv>
					<Separator />
				</MarginDiv>
				<MarginDiv>
					{prettyNumber(cluster.duplicateCount)}{' '}
					{`exact ${plural('duplicate', cluster.duplicateCount)}`}
				</MarginDiv>
				<MarginDiv>
					<Separator />
				</MarginDiv>
				<MarginDiv>
					{prettyNumber(cluster.variantCount)}{' '}
					{plural('variant', cluster.variantCount)}
				</MarginDiv>
			</ColorDiv>
			{expanded ? <StyledTextList lines={lines} diff={true} /> : null}
		</MarginDiv>
	)
})

const expandIconButtonProps = { iconName: 'GroupList' }

const MarginDiv = styled.div<{ margin?: string }>`
	margin: ${props => props.margin ?? '8px 0 0 0'};
`
const Sentence = styled.div`
	font-size: 12px;
`

const ColorDiv = styled.div<{ color: string }>`
	display: flex;
	font-size: 0.8em;
	color: ${props => props.color};
`
const StyledTextList = styled(TextList)`
	margin-left: 10px;
	font-size: 10px;
`

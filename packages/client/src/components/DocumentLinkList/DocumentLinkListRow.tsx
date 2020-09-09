/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { Document, Sentence } from '@newsthreads/schema/lib/client-types'
import { useThematic } from '@thematic/react'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useDiffColor } from '../../hooks'
import { DiffSide } from '../../state'

interface RowProps {
	onCompare?: (docid: string) => void
	left: string | null
	right: string | null
	sentence: Sentence
	selected: Document | null
	onSelect: (docid: string) => void
}

const documentSearchIconProps = {
	iconName: 'DocumentSearch',
	styles: {
		root: {
			fontSize: 12,
		},
	},
}

const documentSearchStyles = {
	root: {
		width: 16,
		height: 16,
	},
}

const compareDocumentsStyles = {
	root: {
		width: 16,
		height: 16,
	},
}

export const DocumentLinkListRow: React.FC<RowProps> = memo(
	function DocumentLinkListRow({
		sentence,
		selected,
		onSelect,
		onCompare,
		left,
		right,
	}) {
		const sentenceDocId = sentence.document.docid
		const theme = useThematic()
		const matched = selected != null && selected.docid === sentenceDocId
		const handleSearchClick = useCallback(() => {
			if (onSelect) {
				onSelect(sentenceDocId)
			}
		}, [onSelect, sentenceDocId])
		const handleCompareClick = useCallback(() => {
			if (onCompare) {
				onCompare(sentenceDocId)
			}
		}, [onCompare, sentenceDocId])
		const canCompare = useMemo(() => !!onCompare, [onCompare])
		const leftColor = useDiffColor(DiffSide.Left)
		const rightColor = useDiffColor(DiffSide.Right)
		const compareColor =
			sentenceDocId === left
				? leftColor
				: sentenceDocId === right
				? rightColor
				: theme.application().accent().hex()

		const compareDocumentsIconProps = useMemo(() => {
			return {
				iconName: 'DiffSideBySide',
				styles: {
					root: {
						fontSize: 12,
						color: compareColor,
					},
				},
			}
		}, [compareColor])

		return (
			<Container>
				<IconButton
					disabled={matched}
					title="View this document"
					iconProps={documentSearchIconProps}
					styles={documentSearchStyles}
					onClick={handleSearchClick}
				/>
				<IconButton
					disabled={!canCompare}
					title="Compare this document"
					iconProps={compareDocumentsIconProps}
					styles={compareDocumentsStyles}
					onClick={handleCompareClick}
				/>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 32px;
	height: 16px;
`

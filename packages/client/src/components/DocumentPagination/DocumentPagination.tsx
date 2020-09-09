/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Text, IconButton } from '@fluentui/react'
import React, { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { useSearch, useDocuments } from '../../hooks'

const prevIconProps = {
	iconName: 'CaretSolidLeft',
}

const nextIconProps = {
	iconName: 'CaretSolidRight',
}

export const DocumentPagination: React.FC = memo(function DocumentPagination() {
	const [offset, setOffset] = useSearch<number>('offset')
	const [count] = useSearch<number>('count')
	const [documents, totalDocuments] = useDocuments()

	const page = useMemo(() => {
		return offset + 1
	}, [offset])

	const pageTotal = useMemo(() => {
		return Math.ceil(totalDocuments / count)
	}, [totalDocuments, count])

	const handleNav = useCallback(
		(val: number) => {
			return () => {
				setOffset(val)
			}
		},
		[setOffset],
	)

	return (
		<Content>
			<IconButton
				iconProps={prevIconProps}
				onClick={handleNav(offset - 1)}
				disabled={offset === 0}
			/>
			<Text variant="tiny">
				{page} of {pageTotal}
			</Text>
			<IconButton
				iconProps={nextIconProps}
				onClick={handleNav(offset + 1)}
				disabled={documents.length < count}
			/>
		</Content>
	)
})

const Content = styled.div`
	display: flex;
	justify-content: center;
	line-height: 24px;
	align-content: center;
	align-items: center;
	font-size: 0.7em;
`

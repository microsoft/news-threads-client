/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sentence } from '@newsthreads/schema/lib/client-types'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'

import {
	useDiffId,
	useSelectedDocument,
	useSelectedDocumentId,
} from '../../hooks'
import { DiffSide } from '../../state'
import { DocumentLinkListRow } from './DocumentLinkListRow'

interface DocumentLinkListProps {
	sentences: Sentence[]
}

export const DocumentLinkList: React.FC<DocumentLinkListProps> = memo(
	function DocumentLinkList({ sentences }) {
		const [selectedDocument] = useSelectedDocument()
		const [, setSelectedDocumentId] = useSelectedDocumentId()

		const [left, setLeft] = useDiffId(DiffSide.Left)
		const [right, setRight] = useDiffId(DiffSide.Right)

		const handleCompare = useCallback(
			(docId: string) => {
				if (left == null) {
					setLeft(docId)
				} else {
					setRight(docId)
				}
			},
			[left, setLeft, setRight],
		)

		return (
			<StyledPre>
				{sentences.map((sentence, index) => (
					<DocumentLinkListRow
						key={`link-${sentence.document.docid}-${sentence.sid}-${index}`}
						sentence={sentence}
						selected={selectedDocument}
						onSelect={setSelectedDocumentId}
						onCompare={handleCompare}
						left={left}
						right={right}
					/>
				))}
			</StyledPre>
		)
	},
)

const StyledPre = styled.pre`
	margin-top: 2px;
	margin-right: 2px;
`

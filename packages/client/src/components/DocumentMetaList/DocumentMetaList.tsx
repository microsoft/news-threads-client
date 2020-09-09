/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sentence } from '@newsthreads/schema/lib/client-types'
import React, { memo } from 'react'
import styled from 'styled-components'
import { useSelectedDocument } from '../../hooks'
import { DocumentMetaListRow } from './DocumentMetaListRow'

interface ListProps {
	sentences: Sentence[]
	style?: React.CSSProperties
	showHeadlines?: boolean
}

export const DocumentMetaList: React.FC<ListProps> = memo(
	function DocumentMetaList({ sentences, style, showHeadlines = false }) {
		const [selectedDocument] = useSelectedDocument()

		return (
			<StyledPre style={style}>
				{sentences.map((sentence, index) => (
					<DocumentMetaListRow
						key={`meta-${sentence.document.docid}-${sentence.sid}-${sentence.sindex}-${index}`}
						sentence={sentence}
						selected={selectedDocument}
						showHeadlines={showHeadlines}
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

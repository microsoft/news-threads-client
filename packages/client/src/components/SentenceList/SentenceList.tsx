/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sentence } from '@newsthreads/schema/lib/client-types'
import React, { memo } from 'react'
import styled from 'styled-components'
import { SentenceRow } from './SentenceRow'

interface SentenceListProps {
	sentences: Sentence[]
}

export const SentenceList: React.FC<SentenceListProps> = memo(
	function SentenceList({ sentences }) {
		return (
			<SentenceListContainer>
				{sentences.map(s => (
					<SentenceRow
						key={`sentence-row-${s.document.docid}-${s.sid}-${s.sindex}`}
						sentence={s}
					/>
				))}
			</SentenceListContainer>
		)
	},
)

const SentenceListContainer = styled.div`
	font-size: 0.8em;
	flex: 2;
	width: 100%;
	overflow-y: scroll;
	overflow-x: hidden;
`

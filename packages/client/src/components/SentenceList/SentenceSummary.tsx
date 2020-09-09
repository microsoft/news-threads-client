/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sentence } from '@newsthreads/schema/lib/client-types'
import React, { memo } from 'react'
import styled from 'styled-components'
import { plural } from '../../util/format'
import { Separator } from '../Separator'

interface SentenceSummaryProps {
	sentence: Sentence
	numCopies: number
}

export const SentenceSummary: React.FC<SentenceSummaryProps> = memo(
	function SentenceSummary({ sentence, numCopies: ccount }) {
		const icount = sentence.instanceCount || 0
		const vcount = sentence.variantCount || 0
		const dcount = sentence.duplicateCount || 0

		return (
			<Container>
				<div>{`${icount} sentence ${plural('instance', icount)}`}</div>
				<Separator />
				<div>{`${vcount} ${plural('variation', vcount)}`}</div>
				<Separator />
				<div>{`${dcount} exact ${plural('duplicate', dcount)} of source`}</div>
				<Separator />
				<div>{`${ccount} ${plural(
					'instance',
					ccount,
				)} of variant seen in article`}</div>
			</Container>
		)
	},
)

const Container = styled.div`
	font-size: 0.8em;
	display: flex;
	margin-top: 4px;
	margin-bottom: 8px;
`

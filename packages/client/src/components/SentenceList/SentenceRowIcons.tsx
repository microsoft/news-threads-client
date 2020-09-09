/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon, IconButton, IIconProps } from '@fluentui/react'
import { Sentence } from '@newsthreads/schema/lib/client-types'
import React, { memo } from 'react'
import styled from 'styled-components'
import { plural } from '../../util/format'

interface HighlightedTextProps {
	sentence: Sentence
	onClick: () => void
}

export const SentenceRowIcons: React.FC<HighlightedTextProps> = memo(
	function SentenceRowIcons({ sentence, onClick }) {
		const icount = sentence.instanceCount || 0
		const vcount = sentence.variantCount || 0
		const dcount = sentence.duplicateCount || 0
		const tooLarge = icount > 10000
		return (
			<Container>
				<IconButton
					title="Expand sentence instances"
					iconProps={clockIconProps}
					onClick={onClick}
					disabled={tooLarge}
				/>
				{sentence.sid !== sentence.sourceId ? (
					<div title="Sentence appears forked from an earlier source">
						<Icon iconName="BranchFork2" />
					</div>
				) : null}
				<SentenceCounts
					title={`${icount} sentence ${plural(
						'instance',
						icount,
					)}, with ${vcount} ${plural(
						'variation',
						vcount,
					)} and ${dcount} ${plural('duplication', dcount)}`}
				>{`${icount} | ${vcount}`}</SentenceCounts>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const SentenceCounts = styled.div`
	font-size: 0.5em;
`

const clockIconProps: IIconProps = { iconName: 'Clock' }

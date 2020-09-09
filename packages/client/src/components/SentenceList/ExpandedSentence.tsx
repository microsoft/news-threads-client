/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Sentence } from '@newsthreads/schema/lib/client-types'
import React, { memo, useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useSentenceInstances } from '../../hooks'
import { DocumentLinkList } from '../DocumentLinkList'
import { DocumentMetaList } from '../DocumentMetaList'
import { Separator } from '../Separator'
import { TextList } from '../charts/TextList'
import { ToggleLink } from '../controls/ToggleLink'
import { SentenceSummary } from './SentenceSummary'

export interface ExpandedSentenceProps {
	toggled: boolean
	showHeadlines?: boolean
	sentence: Sentence
	onToggleVariants: () => void
	onToggleHeadlines: () => void
}

export const ExpandedSentence: React.FC<ExpandedSentenceProps> = memo(
	function ExpandedSentence({
		sentence,
		toggled,
		showHeadlines = false,
		onToggleVariants,
		onToggleHeadlines,
	}) {
		const [instances, isLoadingSentences] = useSentenceInstances(sentence.sid)
		const [variants, setVariants] = useState<Sentence[]>([])
		const [copies, setCopies] = useState<Sentence[]>([])
		const displayedList = toggled ? instances : variants
		const lines = useMemo(() => displayedList.map(v => v.text), [displayedList])
		useEffect(() => {
			const vts: Sentence[] = Object.keys(
				instances.reduce((acc, cur) => {
					acc[cur.sid] = true
					return acc
				}, {}),
			)
				.map(id => instances.find(s => s.sid === +id))
				.filter(s => s !== undefined)
				.sort(
					(a?: Sentence, b?: Sentence) =>
						(a ? Date.parse(a.document.date) : 0) -
						(b ? Date.parse(b.document.date) : 0),
				) as Sentence[]
			const instanceCopies = instances.filter(s => s.sid === sentence.sid)
			setVariants(vts)
			setCopies(instanceCopies)
		}, [sentence, instances])

		return isLoadingSentences ? null : (
			<Container>
				<SentenceSummary sentence={sentence} numCopies={copies.length} />
				<Links>
					<StyledToggleLink
						messages={INSTANCE_LINK_TOGGLE_OPTIONS}
						onChange={onToggleVariants}
					/>
					<Separator />
					<StyledToggleLink
						messages={HEADLINE_LINK_TOGGLE_OPTIONS}
						onChange={onToggleHeadlines}
					/>
				</Links>
				<SentenceInstances>
					<DocumentLinkList sentences={displayedList} />
					<StyledMetaList
						sentences={displayedList}
						showHeadlines={showHeadlines}
					/>
					<StyledTextList lines={lines} diff={!toggled} />
				</SentenceInstances>
			</Container>
		)
	},
)

const INSTANCE_LINK_TOGGLE_OPTIONS: [string, string] = [
	'show only variations',
	'show all instances',
]

const HEADLINE_LINK_TOGGLE_OPTIONS: [string, string] = [
	'hide headlines',
	'show headlines',
]

const Container = styled.div`
	width: 100%;
	overflow-x: hidden;
`

const Links = styled.div`
	display: flex;
`
const StyledToggleLink = styled(ToggleLink)`
	margin-bottom: 8px;
`
const StyledMetaList = styled(DocumentMetaList)`
	font-size: 10px;
`
const StyledTextList = styled(TextList)`
	font-size: 10px;
	overflow-x: scroll;
	margin-right: 15px;
`
const SentenceInstances = styled.div`
	display: flex;
	width: 100%;
	overflow-x: hidden;
`

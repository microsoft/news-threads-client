/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import React, { memo } from 'react'
import styled from 'styled-components'
import {
	useDocuments,
	useSelectedDocument,
	useSelectedDocumentId,
} from '../../hooks'
import { DailySparklinesStack } from '../DailySparklinesStack'
import { DocumentHeader } from '../DocumentHeader'
import { DocumentList } from '../DocumentList'
import { DocumentSearch } from '../DocumentSearch'
import { SentenceList } from '../SentenceList'
import { Visible } from '../Visible'
import { DiffOverlay } from './DiffOverlay'

export const DocumentSearchPage: React.FC = memo(function DocumentSearchPage() {
	const theme = useThematic()
	const [documents, totalCount, loading] = useDocuments()
	const [, setSelectedDocumentId] = useSelectedDocumentId()
	const [selectedDocument] = useSelectedDocument()

	return (
		<Container>
			<DocumentSearch />
			<DocumentListOverflow>
				<SearchResults>
					<H2 theme={theme}>Articles</H2>
					<DailySparklinesStack />
					<Space />
					<Visible show={loading}>
						<div>
							<Spinner />
						</div>
					</Visible>
					<DocumentList
						documents={documents}
						total={totalCount}
						onSelect={setSelectedDocumentId}
						selected={selectedDocument}
					/>
				</SearchResults>
				<DocumentSentences>
					<H2 theme={theme}>Selected article</H2>
					{selectedDocument && (
						<>
							<StyledDocumentHeader
								document={selectedDocument}
								theme={theme}
								selected={true}
							/>
							<SentenceList sentences={selectedDocument.sentences} />
						</>
					)}
				</DocumentSentences>
				<DiffOverlay />
			</DocumentListOverflow>
		</Container>
	)
})

const Container = styled.div`
	flex: 1;
	height: 100%;
	margin-top: 30px;
	display: flex;
	flex-direction: column;
	overflow-y: hidden;
`

const H2 = styled.h2<{ theme: Theme }>`
	font-weight: 900;
	text-transform: uppercase;
	color: ${props => props.theme.application().lowContrast().hex()};
`

const DocumentListOverflow = styled.div`
	flex: 1;
	display: flex;
	overflow-y: hidden;
`

const SearchResults = styled.div`
	flex: 1 1 420px;
	min-width: 420px;
	height: 100%;
	display: flex;
	flex-flow: column;
	overflow-y: hidden;
`

const DocumentSentences = styled.div`
	flex: 1 1 auto;
	margin-left: 28px;
	width: 100%;
	overflow-y: hidden;
	display: flex;
	flex-flow: column;
`

const StyledDocumentHeader = styled(DocumentHeader)<{ theme: Theme }>`
	width: 100%;
	margin-left: 0px;
	margin-bottom: 12px;
	border-bottom: 1px solid
		${props => props.theme.application().lowContrast().hex()};
`

const Space = styled.div`
	height: 12px;
`

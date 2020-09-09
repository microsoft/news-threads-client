/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Document } from '@newsthreads/schema/lib/client-types'
import React, { memo } from 'react'
import { useSourceDocuments } from '../../hooks/documents'
import { TimelineStrip } from '../charts/TimelineStrip'

interface DocumentSentencesTimelineProps {
	document: Document
}

export const DocumentSourcesTimeline: React.FC<DocumentSentencesTimelineProps> = memo(
	function DocumentSourcesTimeline({ document }) {
		const [sources] = useSourceDocuments(document.docid)
		return <TimelineStrip documents={sources} width={500} height={24} />
	},
)

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Document } from '@newsthreads/schema/lib/client-types'
import { useDocument } from './useDocument'
import { useSelectedDocumentId } from './useSelectedDocumentId'

export function useSelectedDocument(): [Document | null, boolean] {
	const [selectedDocumentId] = useSelectedDocumentId()
	return useDocument(selectedDocumentId)
}

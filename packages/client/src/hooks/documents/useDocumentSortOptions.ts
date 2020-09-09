/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { DocumentSortBy } from '../../state'
import { useSelectedDatasetFeatures } from '../dataset'
import { useSearch } from '../useSearch'

/**
 * A get/set hook for the current document sorting state
 */
export function useDocumentSortOptions(): string[] {
	const [query] = useSearch<string>('query')
	const datasetFeatures = useSelectedDatasetFeatures()

	const sortOptions = useMemo(() => {
		const options: string[] = Object.values(DocumentSortBy)
		return options.filter(opt => {
			// If no text search then remove ability to sort by text score
			if (opt === DocumentSortBy.Score && !query) {
				return false
			}

			if (opt === DocumentSortBy.DomainScore && !datasetFeatures.domains) {
				return false
			}

			if (
				(opt === DocumentSortBy.Duplication ||
					opt === DocumentSortBy.Variation) &&
				!datasetFeatures.docstats
			) {
				return false
			}

			return true
		})
	}, [query, datasetFeatures.docstats, datasetFeatures.domains])

	return sortOptions
}

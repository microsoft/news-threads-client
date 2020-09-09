/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DocumentSortBy, DocumentSort, DocumentSortDirection } from '../state'

/**
 * Pack the user friendly sort by and direction to graphql values.
 * Need to pack the sort direction since the client displays the inverted
 * normalized values for variation and duplication. This function only
 * needs to pack the sort by field after the inverted
 * normalized values are moved up to the datastore.
 */
export function packDocumentSort({
	by,
	direction,
}: DocumentSort): [string, string] {
	switch (by) {
		case DocumentSortBy.Score:
			return ['Score', direction]
		case DocumentSortBy.Date:
			return ['Date', direction]
		case DocumentSortBy.DomainScore:
			return ['DomainScore', direction]
		// Variation and Duplication normalized values are inverted in the client
		// Remove this once the inverted normalized values are stored in the datastore (mongo)
		case DocumentSortBy.Variation:
			return [
				'Variation',
				direction === DocumentSortDirection.Ascending
					? DocumentSortDirection.Descending
					: DocumentSortDirection.Ascending,
			]
		case DocumentSortBy.Duplication:
			return [
				'Duplication',
				direction === DocumentSortDirection.Ascending
					? DocumentSortDirection.Descending
					: DocumentSortDirection.Ascending,
			]
	}
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface PaginationContext {
	limit?: number | null
	offset?: number | null
	sort?: string | null
	dir?: DbSortDirection | null
}
/**
 * An ISO-8601 formatted date string
 */
export type DateString = string

export enum DbSortDirection {
	Ascending = 'asc',
	Descending = 'desc',
}

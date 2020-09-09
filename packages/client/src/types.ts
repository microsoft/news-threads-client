/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Serialized ISO date string for start/end date of a range
 */
export type ISODateRange = [string, string]

export interface DailyTerm {
	term: string
	date: Date
	count: number
}

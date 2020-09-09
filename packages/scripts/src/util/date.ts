/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import moment, { utc } from 'moment'

// init a map of the dates for a range with all days set to no-data value
// if zero range is supplied, this means we're within the range that a missing entry should be 0, not -1
export function dateMap(
	dateRange: [Date, Date],
	zeroRange?: [Date, Date],
): Map<string, number> {
	const map = new Map<string, number>()
	const start = utc(dateRange[0])
	const stop = utc(dateRange[1])
	const delta = stop.diff(start, 'days')
	// init zero range, but put it outside the dateRange if not specified
	const zeroStart = utc(zeroRange ? zeroRange[0] : dateRange[1])
	const zeroStop = utc(zeroRange ? zeroRange[1] : dateRange[1])
	const current = start.clone()
	new Array(delta + 1).fill(1).forEach((d, i) => {
		const date = current.format('YYYY-MM-DD')
		if (current.isSameOrAfter(zeroStart) && current.isSameOrBefore(zeroStop)) {
			map.set(date, 0)
		} else {
			map.set(date, -1)
		}
		current.add(d, 'day')
	})
	return map
}

/**
 * Takes an arbitrary moment-parsable date string and reformats to day precision
 * @param date
 */
export function dateToDayPrecision(date: string): string {
	return moment(date).format('YYYY-MM-DD')
}

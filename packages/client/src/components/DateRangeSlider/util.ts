/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import moment from 'moment'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function convertIsoToDateInteger(date: string): number {
	return Math.floor(moment(date).valueOf() / MS_PER_DAY)
}

export function convertDateIntegerToIso(dayInMs: number): string {
	return convertIntegerToMomentDate(dayInMs).format()
}

export function formatNumericDate(dayInMs: number): string {
	return convertIntegerToMomentDate(dayInMs).format('YYYY-MM-DD')
}

function convertIntegerToMomentDate(dayInMs: number): moment.Moment {
	return moment.utc(dayInMs * MS_PER_DAY)
}

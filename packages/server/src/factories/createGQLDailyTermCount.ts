/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DailyTermCount } from '@newsthreads/schema/lib/provider-types'
import { DbDailyTerm } from '../data'
import { encodeDate } from './util'

export function createGQLDailyTermCount(d: DbDailyTerm): DailyTermCount {
	return {
		...d,
		term: d.text,
		date: encodeDate(d.date) as string,
		__typename: 'DailyTermCount',
	}
}

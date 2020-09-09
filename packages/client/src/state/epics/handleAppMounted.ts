/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Action } from '@reduxjs/toolkit'
import { flow, last, partial, assign } from 'lodash'

import { loadData } from '../initialState'
import {
	searchPartChanged,
	initialSearchState,
	selectedDocumentIdChanged,
	documentSortChanged,
	diffIdChanged,
	DiffSide,
	setDataset,
} from '../slices'
import {
	QueryParameterKeyValuePair,
	hydrateStateFromUrl,
} from './util/hydrateStateFromUrl'

/**
 * Parse query parameter value to number or string.
 * @param queryParameter key value parameter parameter pair
 */
const parseValue = ([key, value]: QueryParameterKeyValuePair): [
	string,
	string | number,
] => {
	// value might be a number
	if (!Number.isNaN(+value)) {
		return [key, +value]
	}
	// or a string or string[]
	return [key, Array.isArray(value) ? value.join(',') : value]
}

const toObj = <T>(key: string) => (value: T) => ({
	[key]: value,
})

/**
 * Map search parameters to redux action
 * recordKey: QueryParameterKeyValuePair => Action
 */
const searchQueryMapper: {
	[key: string]: (x: QueryParameterKeyValuePair) => Action
} = Object.keys(initialSearchState).reduce((acc, key) => {
	return {
		...acc,
		[key]: flow(parseValue, searchPartChanged),
	}
}, {})

/**
 * Map query parameters to redux actions
 * recordKey: QueryParameterKeyValuePair => Action
 */
const queryMapper = {
	dataset: flow(parseValue, last, setDataset),
	...searchQueryMapper,
	sortBy: flow(parseValue, last, toObj<string>('by'), documentSortChanged),
	sortDirection: flow(
		parseValue,
		last,
		toObj<string>('direction'),
		documentSortChanged,
	),
	docid: flow(parseValue, last, selectedDocumentIdChanged),
	diffLeftId: flow(
		parseValue,
		last,
		toObj<string>('id'),
		partial(assign, { side: DiffSide.Left }),
		diffIdChanged,
	),
	diffRightId: flow(
		parseValue,
		last,
		toObj<string>('id'),
		partial(assign, { side: DiffSide.Right }),
		diffIdChanged,
	),
}

function errorHandler(error) {
	console.log('caught error mounting app resources', error)
	// todo: pass error message to redux, present an application error
	return []
}

export const handleAppMounted = hydrateStateFromUrl({
	actions: [loadData.type],
	queryMapper,
	errorHandler,
	skipNullOrEmptyQueryParameterValues: true,
})

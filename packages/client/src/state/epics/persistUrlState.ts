/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as queryString from 'query-string'
import { AppState } from '..'
import { argif } from '../../util/args'
import { parseQuery } from '../../util/parseQuery'
import {
	searchPartChanged,
	selectedDocumentIdChanged,
	documentSortChanged,
	diffIdChanged,
	datasetChanged,
	setSelectedDocumentIdIfNull,
} from '../slices'
import { persistStateToUrl } from './util/persistStateToUrl'

function stateToQueryString(state: AppState) {
	const { dataset, search, documents, diff } = state

	const searchState = {
		...search,
		// serialize the scores/ratios if they are not default/maxed out.
		maxDomainScore: argif(search.maxDomainScore, s => s < 100),
		maxInstanceDuplicateRatio: argif(
			search.maxInstanceDuplicateRatio,
			r => r < 1,
		),
		maxInstanceVariantRatio: argif(search.maxInstanceVariantRatio, r => r < 1),
	}

	const datasetState = {
		dataset: dataset.value,
	}

	const documentsState = {
		docid: documents.selectedDocumentId ?? '',
		sortBy: documents.sort.by,
		sortDirection: documents.sort.direction,
	}

	const diffState = {
		diffLeftId: diff.left.id ?? '',
		diffRightId: diff.right.id ?? '',
	}

	const currentSearch = parseQuery()

	// merge current app state with current url state
	// reduce over querystring object to remove empty/null parameters
	const newSearch = Object.entries({
		...currentSearch,
		...datasetState,
		...searchState,
		...documentsState,
		...diffState,
	}).reduce((searchObj, [key, value]) => {
		// remove empty query parameters.
		if (value) {
			return {
				...searchObj,
				[key]: value,
			}
		}
		return searchObj
	}, {})

	return queryString.stringify(newSearch)
}

function errorHandler(error) {
	console.log('caught error persisting state to URL.', error)
	// todo: pass error message to redux, present an application error
	return []
}

export const persistUrlState = persistStateToUrl({
	actions: [
		searchPartChanged.type,
		selectedDocumentIdChanged.type,
		setSelectedDocumentIdIfNull.type,
		documentSortChanged.type,
		diffIdChanged.type,
		datasetChanged.type,
	],
	stateToQueryString,
	errorHandler,
})

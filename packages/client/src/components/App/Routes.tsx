/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { lazy } from 'react'
import { memo } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Pages } from './Pages'

const ContentAnalysisPage = lazy(
	() =>
		import(
			/* webpackChunkName: "ContentAnalysisPage" */ '../ContentAnalysisPage'
		),
)
const DocumentSearchPage = lazy(
	() =>
		import(
			/* webpackChunkName: "DocumentSearchPage" */ '../DocumentSearchPage'
		),
)

const DomainAnalysisPage = lazy(
	() =>
		import(
			/* webpackChunkName: "DomainAnalysisPage" */ '../DomainAnalysisPage'
		),
)

const QueryAnalysisPage = lazy(
	() =>
		import(/* webpackChunkName: "QueryAnalysisPage" */ '../QueryAnalysisPage'),
)

export const Routes: React.FC = memo(function Routes() {
	return (
		<>
			<Switch>
				<Route exact path="/" component={DocumentSearchPage} />
				<Route path={Pages.DocumentSearch} component={DocumentSearchPage} />
				<Route path={Pages.ContentAnalysis} component={ContentAnalysisPage} />
				<Route path={Pages.DomainAnalysis} component={DomainAnalysisPage} />
				<Route path={Pages.QueryAnalysis} component={QueryAnalysisPage} />
			</Switch>
		</>
	)
})

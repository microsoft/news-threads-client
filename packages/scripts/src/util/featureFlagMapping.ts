/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const featureFlagMapping: Map<string, Record<string, any>> = new Map([
	[
		'sentence_cluster_summaries',
		{
			sentenceAnalysis: true,
		},
	],
	[
		'PRECOMPUTE_docstats',
		{
			docstats: true,
		},
	],
	[
		'daily_counts',
		{
			dailyTermCounts: true,
		},
	],
	[
		'PRECOMPUTE_domain_summaries',
		{
			domains: true,
		},
	],
	[
		'PRECOMPUTE_query_counts',
		{
			dailyQueryCounts: true,
		},
	],
])

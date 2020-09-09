/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Resolvers } from '@newsthreads/schema/lib/provider-types'
import { Document } from './Document'
import { DocumentCluster } from './DocumentCluster'
import { Long } from './Long'
import { Query } from './Query'
import { Sentence } from './Sentence'

export const resolvers: Resolvers = {
	// Primitive Resolvers
	Long,

	// Domain Resolvers
	Query,
	Document,
	DocumentCluster,
	Sentence,
}

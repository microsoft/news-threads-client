/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppDataSources } from '../dataSources'

export interface ServerGqlContext {
	dataSources: AppDataSources
	user: any | null
}

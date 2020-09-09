/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { readFileSync } from 'fs'

const schemaFileName = require.resolve('@newsthreads/schema/schema.gql')
export const schemaText = readFileSync(schemaFileName, { encoding: 'utf8' })

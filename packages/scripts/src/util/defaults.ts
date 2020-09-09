/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { join } from 'path'
export const DEFAULT_DB_URL = 'mongodb://localhost:27017'
export const DEFAULT_CONFIG = join(__dirname, '../../config.json')
export const DEFAULT_DATA_ROOT = `${process.env.HOME}/news-data`
export const DEFAULT_OUTPUT_ROOT = `${process.env.HOME}/news-data`
export const DEFAULT_BATCH_SIZE = 1000
export const DEFAULT_BATCH_PARALLELISM = 50
export const DEFAULT_NUM_RETRIES = 100

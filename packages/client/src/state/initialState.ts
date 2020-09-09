/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createAction } from '@reduxjs/toolkit'

export const loadData = createAction<void>('fetch-initial-datasets')

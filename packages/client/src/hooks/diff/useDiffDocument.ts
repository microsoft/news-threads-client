/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Document } from '@newsthreads/schema/lib/client-types'
import { DiffSide } from '../../state'
import { useDocument } from '../documents'
import { useDiffId } from './useDiffId'

export function useDiffDocument(side: DiffSide): [Document | null, boolean] {
	const [docid] = useDiffId(side)
	return useDocument(docid)
}

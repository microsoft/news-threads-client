/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDatasets } from './dataset'

export function useIsLoaded(): boolean {
	const [, loading] = useDatasets()
	return !loading
}

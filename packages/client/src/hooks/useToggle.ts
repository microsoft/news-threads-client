/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useState, useCallback } from 'react'

/**
 * Use boolean toggle logic
 */
export function useToggle(initialState = false): [boolean, () => void] {
	const [toggled, setToggled] = useState<boolean>(initialState)
	const cb = useCallback(() => setToggled(!toggled), [toggled, setToggled])
	return [toggled, cb]
}

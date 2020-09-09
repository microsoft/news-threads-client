/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { debounce } from 'lodash'
import React, { memo, useCallback, useState, useMemo } from 'react'
import { useSearch } from '../../hooks'

export const SiteSearch: React.FC = memo(function SiteSearch() {
	const [searchSite, setSearchSite] = useSearch<string>('domain')
	const [localSite, setLocalSite] = useState<string>(searchSite)

	const updateSeachSite = useMemo(() => {
		return debounce(setSearchSite, CONFIG.search.debounce)
	}, [setSearchSite])

	const handleSiteChange = useCallback(
		(e, newSite: string | undefined) => {
			setLocalSite(newSite ?? '')
			updateSeachSite(newSite ?? '')
		},
		[setLocalSite, updateSeachSite],
	)

	return (
		<TextField
			ariaLabel="Site:"
			placeholder="Site"
			value={localSite}
			onChange={handleSiteChange}
		/>
	)
})

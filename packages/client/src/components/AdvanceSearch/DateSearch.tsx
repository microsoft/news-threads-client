/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DatePicker } from '@fluentui/react'
import React, { memo, useCallback, useState, useEffect } from 'react'

interface DateSearchProps {
	placeholder: string
	value: string
	onSelectDate: (newDate: string) => void
}

export const DateSearch: React.FC<DateSearchProps> = memo(function DateSearch({
	placeholder,
	value,
	onSelectDate,
}) {
	const [localDate, setLocalDate] = useState<Date | undefined>()

	const handleDateChange = useCallback(
		(newDate: Date | null | undefined) => {
			setLocalDate(newDate || undefined)

			onSelectDate(newDate ? newDate.toISOString() : '')
		},
		[setLocalDate, onSelectDate],
	)

	useEffect(
		function propToLocalDate() {
			setLocalDate(value ? new Date(value) : undefined)
		},
		[setLocalDate, value],
	)

	return (
		<DatePicker
			placeholder={placeholder}
			value={localDate}
			onSelectDate={handleDateChange}
		/>
	)
})

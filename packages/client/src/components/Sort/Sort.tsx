/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Link, Icon } from '@fluentui/react'
import React, { memo, useMemo, CSSProperties } from 'react'
import { Separator } from '../Separator'
interface SortProps {
	as?: React.FC<{ className?: string }>
	className?: string
	currentSortOption: string
	sortOptions: string[]
	onSortChange: (newSort: string) => void
	iconDirection?: -1 | 1
	showSortIcon?: boolean
}

const NO_CLASS_NAME = ''

export const Sort: React.FC<SortProps> = memo(function Sort({
	as: asAs,
	className = NO_CLASS_NAME,
	currentSortOption,
	sortOptions,
	onSortChange,
	iconDirection,
	showSortIcon = false,
}) {
	const styles = useSortOptionStyles(currentSortOption, sortOptions)
	const Element = useMemo(() => {
		return (
			asAs ?? (({ children }) => <div className={className}>{children}</div>)
		)
	}, [asAs, className])

	const SortIcon = useMemo(() => {
		return showSortIcon && iconDirection !== undefined ? (
			<Icon iconName={getSortIcon(iconDirection)} />
		) : null
	}, [showSortIcon, iconDirection])

	return (
		<Element>
			{sortOptions.map((value, ind) => {
				const pretty = value.replace(/([a-z])([A-Z])/g, '$1 $2')
				return (
					<span key={value}>
						<Link onClick={() => onSortChange(value)} style={styles[value]}>
							{pretty}
						</Link>
						{value === currentSortOption && showSortIcon ? (
							<> {SortIcon}</>
						) : null}
						{ind !== sortOptions.length - 1 && <Separator />}
					</span>
				)
			})}
		</Element>
	)
})

function useSortOptionStyles(
	selected: string,
	options: string[],
): Record<string, CSSProperties> {
	return useMemo<Record<string, CSSProperties>>(() => {
		return options.reduce((stylemap, sortOption) => {
			stylemap[sortOption] = {
				fontWeight: sortOption === selected ? 'bold' : 'normal',
			}
			return stylemap
		}, {} as Record<string, CSSProperties>)
	}, [options, selected])
}

function getSortIcon(iconDirection: 1 | -1): string {
	return iconDirection === -1 ? 'SortDown' : 'SortUp'
}

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Domain as DomainData } from '@newsthreads/schema/lib/client-types'
import React, { memo, CSSProperties, useMemo } from 'react'
import styled from 'styled-components'
import { truncate } from '../../util/format'
import { DomainGem } from '../gems'
import { Link } from './Link'

export interface DomainProps {
	className?: string
	style?: CSSProperties
	domain: DomainData
	link?: string
	maxDomainChars?: number
	gemRadius?: number
	showGem?: boolean
}

export const Domain: React.FC<DomainProps> = memo(function Domain({
	className,
	style,
	domain: data,
	link,
	maxDomainChars,
	gemRadius,
	showGem = false,
}) {
	const domainTitle = useMemo(
		() =>
			maxDomainChars == null
				? data.domain
				: truncate(data.domain, maxDomainChars),
		[data, maxDomainChars],
	)
	return (
		<Container className={className} style={style}>
			{showGem ? <StyledDomainGem info={data} radius={gemRadius} /> : null}
			<Title>{domainTitle}</Title>
			{link == null ? null : <Link url={link} />}
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

const StyledDomainGem = styled(DomainGem)`
	margin-right: 3px;
`
const Title = styled.span`
	margin-right: 3px;
`

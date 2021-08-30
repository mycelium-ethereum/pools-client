import React from 'react';
import styled from 'styled-components';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Logo } from '@components/General';
import { Direction, ARB_ETH, ETH_ARB } from './state';

export default (({ direction, setDirection }) => {
	return (
		<Container>
			<Side>
				<Label>From</Label>
				<div>
					<StyledLogo ticker={direction === ARB_ETH ? 'ARBITRUM' : 'ETH'}/>
				</div>
			</Side>
			<ArrowRightOutlined onClick={() => {
				setDirection(direction === ARB_ETH ? ETH_ARB : ARB_ETH)
			}}/>
			<Side>
				<Label>From</Label>
				<div>
					<StyledLogo ticker={direction === ARB_ETH ? 'ETH' : 'ARBITRUM'}/>
				</div>
			</Side>
		</Container>
	)
}) as React.FC<{
	direction: Direction,
	setDirection: (direction: Direction) => void
}>

const Container = styled.span`
	display: inline;
	
`

const Side = styled.span``

const Label = styled.p``

const StyledLogo = styled(Logo)``


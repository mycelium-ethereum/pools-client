import TimeLeft from '@components/TimeLeft';
import { toApproxCurrency } from '@libs/utils';
import React from 'react';
import styled from 'styled-components';

export default (({ expectedPrice, token, nextRebalance, skew }) => {
	
    return (
		<Summary>
			<Section>
				<Label>
					Expected price
				</Label>
				<Value>
					{toApproxCurrency(expectedPrice)}
				</Value>
			</Section>
			<Section>
				<Label>
					Expected tokens 
				</Label>
				<Value>
					{token}
				</Value>
			</Section>
			<Section>
				<Label>
					Next mint	
				</Label>
				<Value>
					<TimeLeft targetTime={nextRebalance} />
				</Value>
			</Section>
			<Section>
				<Label>
					Pool skew	
				</Label>
				<Value>
					{skew}*
				</Value>
			</Section>
		</Summary>
	);
}) as React.FC<{
	expectedPrice: number,
	token: string,
	nextRebalance: number,
	skew: number
}>;


const Summary = styled.div`
`
const Section = styled.div`
`
const Label = styled.span`
	font-weight: bold;
`
const Value = styled.span`
	margin-left: 0.5rem;
`
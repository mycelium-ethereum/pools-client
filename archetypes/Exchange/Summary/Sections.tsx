import React from 'react';
import BigNumber from 'bignumber.js';
import { toApproxCurrency } from '@libs/utils/converters';
import { Transparent } from './styles';

export const ExpectedTokenPrice: React.FC<{
    tokenPrice: BigNumber;
}> = ({ tokenPrice }) => (
    <div>
        <Transparent>{` at ${toApproxCurrency(tokenPrice ?? 1, 2)} USD/token`}</Transparent>
    </div>
);

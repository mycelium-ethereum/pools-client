import React from 'react';
import BigNumber from 'bignumber.js';
import { toApproxCurrency } from '~/utils/converters';
import { InnerCellSubText } from './styles';

export const TokensAt = ({
    amount,
    price,
    tokenSymbol,
}: {
    amount: BigNumber;
    price: BigNumber;
    tokenSymbol: string;
}): JSX.Element => (
    <>
        <div>{amount.toFixed(2)} tokens</div>
        <InnerCellSubText>
            at {toApproxCurrency(price)} {tokenSymbol}/token
        </InnerCellSubText>
    </>
);

export const TokensNotional = ({
    amount,
    price,
    settlementTokenSymbol,
    approximate = false
}: {
    amount: BigNumber;
    price: BigNumber;
    settlementTokenSymbol: string;
    approximate?: boolean;
}): JSX.Element => (
    <>
        <div>${approximate ? '~' : ''}{`${amount.times(price).toFixed(5)} ${settlementTokenSymbol}`}</div>
        <InnerCellSubText>
            {`${amount.toFixed(5)} tokens at ${approximate ? '~' : ''}${price.toFixed(5)} ${settlementTokenSymbol}/token`}
        </InnerCellSubText>
    </>
);

export default {
    TokensNotional,
    TokensAt,
};

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
}: {
    amount: BigNumber;
    price: BigNumber;
    settlementTokenSymbol: string;
}): JSX.Element => (
    <>
        <div>{`${amount.times(price).toFixed(3)} ${settlementTokenSymbol}`}</div>
        <InnerCellSubText>
            {`${amount.toFixed(3)} tokens at ${price.toFixed(2)} ${settlementTokenSymbol}/token`}
        </InnerCellSubText>
    </>
);

export default {
    TokensNotional,
    TokensAt,
};

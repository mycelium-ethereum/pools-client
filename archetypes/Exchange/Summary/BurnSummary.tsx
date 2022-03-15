import React, { useState } from 'react';
import { calcNotionalValue } from '@tracer-protocol/pools-js';
import { ShowDetailsButton } from './styles';
import { ExpectedFees, ExpectedTokenValue } from './Sections';
import { BurnSummaryProps } from './types';
import ArrowDown from '@public/img/general/caret-down-white.svg';

export const BurnSummary: React.FC<BurnSummaryProps> = ({ amount, nextTokenPrice, pool, gasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);
    return (
        <>
            <ExpectedTokenValue
                nextTokenPrice={nextTokenPrice}
                amount={amount}
                quoteTokenSymbol={pool.quoteTokenSymbol}
                showTransactionDetails={showTransactionDetails}
            />
            <ExpectedFees
                quoteTokenSymbol={pool.quoteTokenSymbol}
                commitNotionalValue={calcNotionalValue(nextTokenPrice, amount)}
                amount={amount}
                gasFee={gasFee}
                showTransactionDetails={showTransactionDetails}
            />

            <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </ShowDetailsButton>
        </>
    );
};

export default BurnSummary;

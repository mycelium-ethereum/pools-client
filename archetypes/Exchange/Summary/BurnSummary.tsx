import React, { useState } from 'react';
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
                settlementTokenSymbol={pool.settlementTokenSymbol}
                showTransactionDetails={showTransactionDetails}
            />
            <ExpectedFees amount={amount} gasFee={gasFee} showTransactionDetails={showTransactionDetails} />

            <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </ShowDetailsButton>
        </>
    );
};

export default BurnSummary;

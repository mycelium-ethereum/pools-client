import React, { useState } from 'react';
import ArrowDown from '~/public/img/general/caret-down-white.svg';
import { ExpectedFees, ExpectedTokenValue } from './Sections';
import { ShowDetailsButton } from './styles';
import { BurnSummaryProps } from './types';

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

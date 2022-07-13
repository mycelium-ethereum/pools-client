import React, { useState } from 'react';
import ArrowDown from '~/public/img/general/caret-down-white.svg';
import { ExpectedBurnFees, ExpectedTokenValue } from './Sections';
import { ShowDetailsButton } from './styles';
import { BurnSummaryProps } from './types';

export const BurnSummary: React.FC<BurnSummaryProps> = ({ amount, nextTokenPrice, pool, gasFee, burningFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);
    return (
        <>
            <ExpectedTokenValue
                nextTokenPrice={nextTokenPrice}
                amount={amount}
                settlementTokenSymbol={pool.settlementTokenSymbol}
                showTransactionDetails={showTransactionDetails}
            />
            <ExpectedBurnFees
                amount={amount}
                gasFee={gasFee}
                showTransactionDetails={showTransactionDetails}
                burningFee={burningFee}
            />

            <ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </ShowDetailsButton>
        </>
    );
};

export default BurnSummary;

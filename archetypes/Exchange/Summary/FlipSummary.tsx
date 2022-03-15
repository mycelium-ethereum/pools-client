import React, { useMemo, useState } from 'react';
import { calcNotionalValue } from '@tracer-protocol/pools-js';

import * as Styles from './styles';
import { ExpectedExposure, ExpectedFees, ExpectedFlipAmounts, ReceiveToken } from './Sections';
import { FlipSummaryProps } from './types';

import ArrowDown from '@public/img/general/caret-down-white.svg';

const FlipSummary: React.FC<FlipSummaryProps> = ({ pool, isLong, amount, nextTokenPrice, gasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const flippedToken = useMemo(
        () => (isLong ? pool.shortToken : pool.longToken),
        [isLong, pool.longToken, pool.shortToken],
    );
    const baseAsset = pool.name?.split('-')[1]?.split('/')[0];
    const commitNotionalValue = calcNotionalValue(nextTokenPrice, amount);
    const flippedEquivalentExposure: number =
        (commitNotionalValue.toNumber() / pool.oraclePrice.toNumber()) * pool.leverage;
    const flippedCommitAmount: number = commitNotionalValue.toNumber() / pool.oraclePrice.toNumber();

    return (
        <>
            <ReceiveToken tokenSymbol={flippedToken.symbol} />
            <Styles.Divider />
            <ExpectedFlipAmounts
                showTransactionDetails={showTransactionDetails}
                amount={amount}
                nextTokenPrice={nextTokenPrice}
                flippedTokenSymbol={flippedToken.symbol}
                commitNotionalValue={commitNotionalValue}
                isLong={isLong}
            />
            <ExpectedFees
                amount={amount}
                commitNotionalValue={commitNotionalValue}
                quoteTokenSymbol={pool.quoteToken.symbol}
                gasFee={gasFee}
                showTransactionDetails={showTransactionDetails}
            />
            <ExpectedExposure
                label="Expected Exposure"
                expectedExposure={flippedEquivalentExposure}
                commitAmount={flippedCommitAmount}
                baseAsset={baseAsset}
                oraclePrice={pool.oraclePrice}
                poolLeverage={pool.leverage}
                showTransactionDetails={showTransactionDetails}
            />
            <Styles.ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </Styles.ShowDetailsButton>
        </>
    );
};

export default FlipSummary;

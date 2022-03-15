import React, { useState } from 'react';
import * as Styles from './styles';
import { ExpectedExposure, ExpectedTokensMinted, TotalMintCosts } from './Sections';
import { MintSummaryProps } from './types';
import ArrowDown from '@public/img/general/caret-down-white.svg';

const MintSummary: React.FC<MintSummaryProps> = ({ amount, nextTokenPrice, token, pool, gasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const expectedAmount = amount.div(nextTokenPrice ?? 1);
    const poolPowerLeverage = pool.leverage;

    const baseAsset = pool.name?.split('-')[1]?.split('/')[0];
    const equivalentExposure = amount.div(pool.oraclePrice.toNumber()).times(poolPowerLeverage).toNumber();

    const commitAmount = amount.div(pool.oraclePrice).toNumber();
    return (
        <>
            <TotalMintCosts amount={amount} gasFee={gasFee} showTransactionDetails={showTransactionDetails} />
            <ExpectedTokensMinted
                showTransactionDetails={showTransactionDetails}
                expectedTokensMinted={expectedAmount.toNumber()}
                nextTokenPrice={nextTokenPrice}
                tokenSymbol={token.symbol}
            />
            <ExpectedExposure
                label={'Expected Equivalent Exposure'}
                baseAsset={baseAsset}
                oraclePrice={pool.oraclePrice}
                commitAmount={commitAmount}
                poolLeverage={poolPowerLeverage}
                expectedExposure={equivalentExposure}
                showTransactionDetails={showTransactionDetails}
            />
            <Styles.ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </Styles.ShowDetailsButton>
        </>
    );
};

export default MintSummary;

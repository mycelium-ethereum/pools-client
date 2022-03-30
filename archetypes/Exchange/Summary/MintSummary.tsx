import React, { useState } from 'react';
import * as Styles from './styles';
import { ExpectedExposure, ExpectedTokensMinted, TotalMintCosts } from './Sections';
import { MintSummaryProps } from './types';
import ArrowDown from '@public/img/general/caret-down-white.svg';
import { calcExposure, calcNumTokens } from './utils';
import { getBaseAsset } from '~/utils/converters';

const MintSummary: React.FC<MintSummaryProps> = ({ amount, nextTokenPrice, token, pool, gasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const poolPowerLeverage = pool.leverage;
    const baseAsset = getBaseAsset(pool.name);
    const equivalentExposure = calcExposure(amount, pool.oraclePrice, poolPowerLeverage).toNumber();
    const expectedAmount = calcNumTokens(amount, nextTokenPrice);
    // commit amount represented in collateral tokens
    const commitAmount = calcNumTokens(amount, pool.oraclePrice).toNumber();
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

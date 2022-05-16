import React, { useState } from 'react';
import ArrowDown from '~/public/img/general/caret-down-white.svg';
import { getBaseAsset } from '~/utils/poolNames';
import { ExpectedExposure, ExpectedTokensMinted, TotalMintCosts } from './Sections';
import * as Styles from './styles';
import { MintSummaryProps } from './types';
import { calcExposure, calcNumTokens } from './utils';

const MintSummary: React.FC<MintSummaryProps> = ({ amount, nextTokenPrice, token, pool, gasFee, isLong }) => {
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
                settlementTokenSymbol={pool.settlementTokenSymbol}
            />
            <ExpectedExposure
                label={'Expected equivalent exposure'}
                baseAsset={baseAsset}
                oraclePrice={pool.oraclePrice}
                commitAmount={commitAmount}
                poolLeverage={poolPowerLeverage}
                expectedExposure={equivalentExposure}
                showTransactionDetails={showTransactionDetails}
                isLong={isLong}
            />
            <Styles.ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </Styles.ShowDetailsButton>
        </>
    );
};

export default MintSummary;

import { Farm } from '@libs/types/Staking';
import { BigNumber } from 'bignumber.js';

const UP = 1;
const DOWN = 2;
const NO_CHANGE = 3;

/**
 * Calculate the losing pool multiplier
 * @param newPrice new pool price based on pool balances
 * @param oldPrice old pool price based on pool balances
 * @param leverage pool leverage
 * @returns ratio if the price direction is down and the inverse of ratio if it is up
 */
export const calcLossMultiplier: (oldPrice: BigNumber, newPrice: BigNumber) => BigNumber = (oldPrice, newPrice) => {
    const ratio = calcRatio(oldPrice, newPrice);
    const direction = calcDirection(oldPrice, newPrice);
    return direction.eq(UP) // number go up
        ? new BigNumber(1).div(ratio)
        : ratio;
};

// hourly -> 24 * 365
const COMPOUND_FREQUENCY = 8760;

/**
 * Calculate the compounding gains
 * @param apr annual percentage rate
 * @returns annual percentage yield
 */
export const calcAPY: (apr: BigNumber) => BigNumber = (apr) =>
    apr.div(COMPOUND_FREQUENCY).plus(1).pow(COMPOUND_FREQUENCY).minus(1);

/**
 *
 * Calculate the leveraged losing pool multiplier
 * @param newPrice new pool price based on pool balances
 * @param oldPrice old pool price based on pool balances
 * @param leverage pool leverage
 * @returns ratio^leverage if the price direction is down and the (inverse of ratio)^leverage if it is up
 */
export const calcLeverageLossMultiplier: (oldPrice: BigNumber, newPrice: BigNumber, leverage: BigNumber) => BigNumber =
    (oldPrice, newPrice, leverage) => {
        return calcLossMultiplier(oldPrice, newPrice).pow(leverage);
    };

/**
 * Calculates the percentage the losing pool must transfer on the next upKeep
 * @param oldPrice old pool price based on pool balances
 * @param newPrice new pool price based on pool balances
 * @param leverage pool leverage
 * @returns
 */
export const calcPercentageLossTransfer: (oldPrice: BigNumber, newPrice: BigNumber, leverage: BigNumber) => BigNumber =
    (oldPrice, newPrice, leverage) => {
        return new BigNumber(1).minus(calcLeverageLossMultiplier(oldPrice, newPrice, leverage));
    };

/**
 * Calculates the notional value of tokens
 * @param tokenPrice current price of tokens
 * @param numTokens number of tokens
 * @returns notional value of the tokens
 */
export const calcNotionalValue: (tokenPrice: BigNumber, numTokens: BigNumber) => BigNumber = (
    tokenPrice,
    numTokens,
) => {
    return tokenPrice.times(numTokens);
};

/**
 * Calculates the ratio of the old price to the new price
 */
export const calcRatio: (oldPrice: BigNumber, newPrice: BigNumber) => BigNumber = (oldPrice, newPrice) => {
    if (oldPrice.eq(0)) {
        new BigNumber(0);
    }
    return newPrice.div(oldPrice);
};

export const calcSkew: (shortBalance: BigNumber, longBalance: BigNumber) => BigNumber = (shortBalance, longBalance) => {
    // even rebalance rate is 1 so even skew is 2.
    // This isnt a fully accurate representation since
    //  at shortBalance 0 there there will be short incentive to participate
    if (shortBalance.eq(0)) {
        return new BigNumber(1);
    }
    return longBalance.div(shortBalance);
};

export const calcRebalanceRate: (shortBalance: BigNumber, longBalance: BigNumber) => BigNumber = (
    shortBalance,
    longBalance,
) => {
    return calcSkew(shortBalance, longBalance).minus(1);
};

/**
 * Calcualtes the direction of the price movement
 * @param newPrice new pool price based on pool balances
 * @param oldPrice old pool price based on pool balances
 * @return DOWN (2) if oldPrice > newPrice, NO_CHANGE (3) if newPrice = oldPrice, or UP (1) if newPrice > oldPrice
 */
export const calcDirection: (oldPrice: BigNumber, newPrice: BigNumber) => BigNumber = (oldPrice, newPrice) => {
    // newPrice.div(oldPrice);
    const priceRatio = calcRatio(oldPrice, newPrice);
    if (priceRatio.gt(1)) {
        // number go up
        return new BigNumber(UP);
    } else if (priceRatio.eq(1)) {
        return new BigNumber(NO_CHANGE);
    } else {
        // priceRatio.lt(1)
        return new BigNumber(DOWN);
    }
};

// function getWithdrawAmountOnBurn(
//         uint256 tokenSupply,
//         uint256 amountIn,
//         uint256 balance,
//         uint256 shadowBalance
//     ) external pure returns (uint256) {
//         require(amountIn > 0, "Invalid amount");

//         // Catch the divide by zero error.
//         if (balance == 0 || tokenSupply + shadowBalance == 0) {
//             return amountIn;
//         }
//         bytes16 numerator = ABDKMathQuad.mul(ABDKMathQuad.fromUInt(balance), ABDKMathQuad.fromUInt(amountIn));
//         return ABDKMathQuad.toUInt(ABDKMathQuad.div(numerator, ABDKMathQuad.fromUInt(tokenSupply + shadowBalance)));
//     }

/**
 * Calc minimum amount in to sell
 * @param totalSupply total token supply
 * @param tokenBalance token balance
 * @param minimumCommitSize
 * @param pendingCommits accumulative commit amounts
 * @returns Minimum amount in
 */
export const calcMinAmountIn: (
    totalSupply: BigNumber,
    tokenBalance: BigNumber,
    minimumCommitSize: BigNumber,
    pendingCommits: BigNumber,
) => BigNumber = (totalSupply, tokenBalance, minimumCommitSize, pendingCommits) => {
    // minumumCommitSize = (balance * amountIn) / tokenSupply + shadowPool
    // (minimumCommitSize * (tokenSupply + shadowPool)) / balance
    return minimumCommitSize.times(totalSupply.plus(pendingCommits)).div(tokenBalance.minus(minimumCommitSize));
};

/**
 * Calculate the pool tokens price
 * Since totalQuoteValue will generally be in USD the returned amount
 *  will also be in USD
 */
export const calcTokenPrice: (totalQuoteValue: BigNumber, tokenSupply: BigNumber) => BigNumber = (
    totalQuoteValue,
    tokenSupply,
) => {
    // if supply is 0 priceRatio is 1/1
    if (tokenSupply.eq(0)) {
        return new BigNumber(1);
    }
    return totalQuoteValue.div(tokenSupply);
};

/**
 * Calculates how much value will be transferred between the pools
 *
 * @param oldPrice old pool price based on pool balances
 * @param newPrice new pool price based on pool balances
 * @param leverage pool leverage
 * @param longBalance quote balance of the long pool in USD
 * @param shortBalance quote balance of the short pool in USD
 *
 * returns an object containing longValueTransfer and shortValueTransfer
 */
export const calcNextValueTransfer: (
    oldPrice: BigNumber,
    newPrice: BigNumber,
    leverage: BigNumber,
    longBalance: BigNumber,
    shortBalance: BigNumber,
) => {
    longValueTransfer: BigNumber;
    shortValueTransfer: BigNumber;
} = (oldPrice, newPrice, leverage, longBalance, shortBalance) => {
    const direction = calcDirection(oldPrice, newPrice);
    const percentageLossTransfer = calcPercentageLossTransfer(oldPrice, newPrice, leverage);
    let gain: BigNumber;

    if (direction.eq(UP)) {
        // long wins
        gain = percentageLossTransfer.times(shortBalance);
        // long gains and short loses longs gain
        return {
            longValueTransfer: gain,
            shortValueTransfer: gain.negated(),
        };
    } else if (direction.eq(DOWN)) {
        // short wins
        gain = percentageLossTransfer.times(longBalance).abs();
        return {
            longValueTransfer: gain.negated(),
            shortValueTransfer: gain,
        };
    } // else no value transfer
    return {
        longValueTransfer: new BigNumber(0),
        shortValueTransfer: new BigNumber(0),
    };
};

export const calcBptTokenPrice: (args: {
    bptDetails?: Farm['bptDetails'];
    stakingTokenSupply: Farm['stakingTokenSupply'];
}) => BigNumber = ({ bptDetails, stakingTokenSupply }) => {
    if (!bptDetails) {
        return new BigNumber(0);
    }
    const { tokens } = bptDetails;

    let balancerPoolUSDCValue = new BigNumber(0);

    for (const token of tokens) {
        const tokenUSDCValue = token.usdcPrice.times(token.reserves);
        balancerPoolUSDCValue = balancerPoolUSDCValue.plus(tokenUSDCValue);
    }

    if (balancerPoolUSDCValue.eq(0) || stakingTokenSupply.eq(0)) {
        return new BigNumber(0);
    }

    return balancerPoolUSDCValue.div(stakingTokenSupply);
};

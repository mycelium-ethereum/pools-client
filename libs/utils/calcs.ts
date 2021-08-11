import { BigNumber } from 'bignumber.js';

export const calcTokenPrice: (tokenSupply: BigNumber, totalPoolValue: BigNumber) => BigNumber = (
    tokenSupply,
    totalPoolValue,
) => {
    return totalPoolValue.div(tokenSupply);
};

/**
 *
 * @param priceRatio ratio between old and new price
 * @param direction direction of price movement (base on ratio)
 * @param leverage pool leverage
 * @returns
 */
export const calcLossMultiplier: (priceRatio: BigNumber, leverage: BigNumber) => BigNumber = (priceRatio, leverage) => {
    const direction = calcDirection(priceRatio);
    console.log(priceRatio.toNumber(), 'price ratio');

    return leverage.times(
        (direction.lt(0) ? new BigNumber(1) : new BigNumber(0))
            .times(priceRatio)
            .plus((direction.gte(0) ? new BigNumber(1) : new BigNumber(0)).div(priceRatio)),
    );
};

export const calcRatio: (newPrice: BigNumber, oldPrice: BigNumber) => BigNumber = (newPrice, oldPrice) => {
    if (oldPrice.eq(0)) {
        new BigNumber(0);
    }
    console.log(newPrice.toNumber(), oldPrice.toNumber(), 'devisions');
    console.log(newPrice.div(oldPrice).toNumber(), 'rario');
    return newPrice.div(oldPrice);
};

/**
 * compares ratio to 1
 * @param priceRatio between oldPrice and new
 * @return -1 if x < y, 0 if x = y, or 1 if x > y
 */
export const calcDirection: (priceRatio: BigNumber) => BigNumber = (priceRatio) => {
    if (priceRatio.lt(1)) {
        return new BigNumber(-1);
    } else if (priceRatio.eq(0)) {
        return new BigNumber(0);
    } else {
        return new BigNumber(1);
    }
};

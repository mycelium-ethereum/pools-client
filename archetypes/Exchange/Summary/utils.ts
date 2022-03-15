import BigNumber from 'bignumber.js';

export const calcExposure: (amount: BigNumber, oraclePrice: BigNumber, leverage: number) => BigNumber = (
    amount,
    oraclePrice,
    leverage,
) => amount.div(oraclePrice).times(leverage);

export const calcNumTokens: (collateralAmount: BigNumber, price: BigNumber) => BigNumber = (collateralAmount, price) =>
    collateralAmount.div(price);

import BigNumber from 'bignumber.js';
import { BalanceTypeEnum } from '@tracer-protocol/pools-js';
import { SwapAction } from '~/context/SwapContext';

export type InvalidAmount = {
    isInvalid: boolean;
    message?: string;
};

export type AmountProps = {
    invalidAmount: InvalidAmount;
    amountBN: BigNumber;
    amount: string;
    selectedPool: string | undefined;
    swapDispatch: React.Dispatch<SwapAction>;
    balance: BigNumber;
    tokenSymbol?: string;
    isPoolToken: boolean;
    decimalPlaces?: number;
};

export const WALLET_OPTIONS = [
    {
        key: BalanceTypeEnum.wallet,
        text: 'Wallet',
    },
    {
        key: BalanceTypeEnum.escrow,
        text: 'Escrow',
    },
];

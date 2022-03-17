import { SwapAction } from '@context/SwapContext';
import { BalanceTypeEnum } from '@libs/constants';
import BigNumber from 'bignumber.js';

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
    tokenSymbol: string;
    isPoolToken: boolean;
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

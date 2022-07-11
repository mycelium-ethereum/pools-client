import BigNumber from 'bignumber.js';
import { BalanceTypeEnum } from '@tracer-protocol/pools-js';
import { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
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
    otherBalance?: BigNumber;
    tokenSymbol?: string;
    balanceType?: BalanceTypeEnum | undefined;
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
        tooltip: {
            optionKey: TooltipKeys.EscrowButton,
        },
    },
];

import React from 'react';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import { SwapAction, SwapState, useBigNumber } from '@context/SwapContext';
import { usePool, usePoolActions } from '@context/PoolContext';
import { SideEnum, CommitEnum, CommitActionEnum } from '@libs/constants';
import Button from '@components/General/Button';

const ExchangeButton: React.FC<{
    onClose: () => void;
    swapState: SwapState;
    swapDispatch: React.Dispatch<SwapAction>;
}> = ({ onClose, swapState, swapDispatch }) => {
    const { account } = useWeb3();
    const { handleConnect } = useWeb3Actions();
    const { selectedPool, side, amount, invalidAmount, commitAction } = swapState;

    const amountBN = useBigNumber(amount);

    const pool = usePool(selectedPool);

    const { commit, approve } = usePoolActions();

    if (!account) {
        return (
            <Button
                size="lg"
                variant="primary"
                onClick={(_e) => {
                    handleConnect();
                }}
            >
                Connect Wallet
            </Button>
        );
    } else if (
        (!pool.quoteToken.approvedAmount?.gte(pool.quoteToken.balance) || pool.quoteToken.approvedAmount.eq(0)) &&
        commitAction !== CommitActionEnum.burn
    ) {
        return (
            <>
                <Button
                    size="lg"
                    variant="primary"
                    disabled={!selectedPool}
                    onClick={(_e) => {
                        if (!approve) {
                            return;
                        }
                        approve(selectedPool ?? '', pool.quoteToken.symbol);
                    }}
                >
                    Unlock {pool.quoteToken.symbol}
                </Button>
                <p className="mt-2 text-theme-text text-sm text-center opacity-70">
                    Unlock {pool.quoteToken.symbol} to start investing with Tracer. This is a one-time transaction for
                    each pool.
                </p>
            </>
        );
    } else {
        return (
            <Button
                id="mint-or-burn"
                size="lg"
                variant="primary"
                disabled={!selectedPool || amountBN.eq(0) || invalidAmount.isInvalid}
                onClick={(_e) => {
                    let commitType;
                    if (!commit) {
                        return;
                    }
                    if (commitAction === CommitActionEnum.mint) {
                        commitType = side === SideEnum.long ? CommitEnum.long_mint : CommitEnum.short_mint;
                    } else {
                        // actionType === CommitActionEnum.burn
                        commitType = side === SideEnum.long ? CommitEnum.long_burn : CommitEnum.short_burn;
                    }
                    commit(selectedPool ?? '', commitType, amountBN, {
                        onSuccess: () => {
                            swapDispatch?.({ type: 'setAmount', value: '' });
                            onClose();
                        },
                    });
                }}
            >
                Ok, let&apos;s {commitAction === CommitActionEnum.mint ? 'mint' : 'burn'}
            </Button>
        );
    }
};

export default ExchangeButton;

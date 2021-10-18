import React from 'react';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import { swapDefaults, useSwapContext } from '@context/SwapContext';
import { usePool, usePoolActions } from '@context/PoolContext';
import { SideEnum, CommitEnum, CommitActionEnum } from '@libs/constants';
import Button from '@components/General/Button';
import BigNumber from 'bignumber.js';

const ExchangeButton: React.FC<{ actionType: CommitActionEnum }> = ({ actionType }) => {
    const { account } = useWeb3();
    const { handleConnect } = useWeb3Actions();
    const { swapState = swapDefaults, swapDispatch } = useSwapContext();
    const { selectedPool, side, amount, invalidAmount, commitAction } = swapState;

    const pool = usePool(selectedPool);

    const { commit, approve } = usePoolActions();

    const ButtonContent = () => {
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
        }
        if (
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
                            approve(selectedPool ?? '');
                        }}
                    >
                        Unlock USDC
                    </Button>
                    <p className="mt-2 text-theme-text text-sm text-center opacity-70">
                        Unlock USDC to start investing with Tracer. This is a one-time transaction for each pool.
                    </p>
                </>
            );
        } else {
            return (
                <Button
                    size="lg"
                    variant="primary"
                    disabled={!selectedPool || amount.eq(0) || invalidAmount.isInvalid}
                    onClick={(_e) => {
                        let commitType;
                        if (!commit) {
                            return;
                        }
                        if (actionType === CommitActionEnum.mint) {
                            commitType = side === SideEnum.long ? CommitEnum.long_mint : CommitEnum.short_mint;
                        } else {
                            // actionType === CommitActionEnum.burn
                            commitType = side === SideEnum.long ? CommitEnum.long_burn : CommitEnum.short_burn;
                        }
                        commit(selectedPool ?? '', commitType, amount, {
                            onSuccess: () => {
                                swapDispatch?.({ type: 'setAmount', value: new BigNumber(0) });
                            },
                        });
                    }}
                >
                    Ok, let&apos;s {actionType === CommitActionEnum.mint ? 'mint' : 'burn'}
                </Button>
            );
        }
    };

    return <>{ButtonContent()}</>;
};

export default ExchangeButton;

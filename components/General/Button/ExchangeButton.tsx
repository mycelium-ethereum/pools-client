import React from 'react';
import styled from 'styled-components';
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
    const { selectedPool, side, amount, invalidAmount } = swapState;

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
        if (!pool.quoteToken.approvedAmount?.gte(pool.quoteToken.balance)) {
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
                    <HelperText>
                        Unlock USDC to start investing with Tracer. This is a one-time transaction for each pool.
                    </HelperText>
                </>
            );
        } else {
            return (
                <Button
                    size="lg"
                    variant="primary"
                    disabled={!selectedPool || amount.eq(0) || invalidAmount.isInvalid}
                    onClick={(_e) => {
                        let side_;
                        if (!commit) {
                            return;
                        }
                        if (actionType === CommitActionEnum.mint) {
                            side_ = side === SideEnum.long ? CommitEnum.long_mint : CommitEnum.short_mint;
                        } else {
                            // actionType === CommitActionEnum.burn
                            side_ = side === SideEnum.long ? CommitEnum.long_burn : CommitEnum.short_burn;
                        }
                        commit(selectedPool ?? '', side_, amount, {
                            onSuccess: () => {
                                swapDispatch?.({ type: 'setAmount', value: new BigNumber(0) });
                            },
                            poolName: pool.name,
                            actionType:
                                actionType === CommitActionEnum.mint ? CommitActionEnum.mint : CommitActionEnum.burn,
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

const HelperText = styled.p`
    color: #6b7280;
    font-size: 14px;
    margin-top: 5px;

    a {
        text-decoration: underline;
        cursor: pointer;
    }
`;

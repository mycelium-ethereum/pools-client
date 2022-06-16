import React from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { TracerMintButton } from '~/archetypes/TokenBuySell/ExchangeButtons';
import Button from '~/components/General/Button';
import { ExchangeButtonProps } from '~/components/General/Button/ExchangeButton';

const MintButton: React.FC<ExchangeButtonProps> = ({
    swapState,
    swapDispatch,
    userBalances,
    approve,
    pool,
    amountBN,
    commit,
    commitType,
}) => {
    const { selectedPool, invalidAmount, commitAction, balanceType } = swapState;

    if (
        (!userBalances.settlementToken.approvedAmount?.gte(userBalances.settlementToken.balance) ||
            userBalances.settlementToken.approvedAmount.eq(0)) &&
        commitAction !== CommitActionEnum.burn
    ) {
        return (
            <Button
                size="lg"
                variant="primary"
                disabled={!selectedPool}
                onClick={(_e) => {
                    if (!approve) {
                        return;
                    }
                    approve(selectedPool ?? '', pool.settlementToken.symbol);
                }}
            >
                Unlock {pool.settlementToken.symbol}
            </Button>
        );
    } else {
        return (
            <TracerMintButton
                disabled={!selectedPool || amountBN.eq(0) || invalidAmount.isInvalid}
                onClick={(_e) => {
                    if (!commit) {
                        return;
                    }

                    commit(selectedPool ?? '', commitType, balanceType, amountBN, {
                        onSuccess: () => {
                            swapDispatch?.({ type: 'setAmount', value: '' });
                        },
                    });
                }}
            >
                <span className="mr-2 inline-block">Mint on</span>
                <img className="w-[90px]" alt="tracer-logo" src={'/img/logos/tracer/tracer_logo.svg'} />
            </TracerMintButton>
        );
    }
};

export default MintButton;

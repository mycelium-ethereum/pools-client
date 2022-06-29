import React from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { TracerMintButton } from '~/archetypes/BuyTokens/ExchangeButtons';
import Button from '~/components/General/Button';
import { ExchangeButtonProps } from '~/components/General/Button/ExchangeButton';
import TracerSVG from '~/public/img/logos/tracer/tracer_logo.svg';

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
                <TracerSVG className="w-[90px]" alt="Tracer logo" />
            </TracerMintButton>
        );
    }
};

export default MintButton;

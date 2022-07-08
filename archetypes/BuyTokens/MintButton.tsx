import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { CommitActionEnum, PoolToken, SideEnum } from '@tracer-protocol/pools-js';
import { TracerMintButton } from '~/archetypes/BuyTokens/ExchangeButtons';
import Button from '~/components/General/Button';
import { ExchangeButtonProps } from '~/components/General/Button/ExchangeButton';
import TracerSVG from '~/public/img/logos/tracer/tracer_logo.svg';
import { calcNumTokens } from '~/archetypes/Exchange/Summary/utils';

export enum MintSourceEnum {
    tracer = 'Tracer',
    balancer = 'Balancer',
}

type MintButtonProps = {
    token: PoolToken;
    isLong: boolean;
    trackBuyAction: (
        side: SideEnum,
        leverage: number,
        tokenToBuy: string,
        tokenToSpend: string,
        tokenBuyAmount: BigNumber,
        tokenSpendAmount: BigNumber,
        balance: BigNumber,
        source: MintSourceEnum,
        isPreCommit: boolean,
    ) => void;
} & ExchangeButtonProps;

const MintButton: React.FC<MintButtonProps> = ({
    swapState,
    swapDispatch,
    userBalances,
    approve,
    pool,
    amountBN,
    commit,
    commitType,
    token,
    isLong,
    trackBuyAction,
}) => {
    const { selectedPool, side, leverage, invalidAmount, commitAction, balanceType } = swapState;
    const nextTokenPrice = useMemo(
        () => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()),
        [isLong, pool.longToken, pool.shortToken],
    );

    const expectedAmount = calcNumTokens(amountBN, nextTokenPrice);

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
                            trackBuyAction(
                                side,
                                leverage,
                                token.name,
                                pool.settlementToken.symbol,
                                expectedAmount,
                                amountBN,
                                userBalances.settlementToken.balance,
                                MintSourceEnum.tracer,
                                false,
                            );
                        },
                    });

                    trackBuyAction(
                        side,
                        leverage,
                        token.name,
                        pool.settlementToken.symbol,
                        expectedAmount,
                        amountBN,
                        userBalances.settlementToken.balance,
                        MintSourceEnum.tracer,
                        true,
                    );
                }}
            >
                <span className="mr-2 inline-block">Mint on</span>
                <TracerSVG className="w-[90px]" alt="Tracer logo" />
            </TracerMintButton>
        );
    }
};

export default MintButton;

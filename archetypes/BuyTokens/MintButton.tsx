import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { PoolToken, SideEnum } from '@tracer-protocol/pools-js';
import { TracerMintButton } from '~/archetypes/BuyTokens/ExchangeButtons';
import { calcNumTokens } from '~/archetypes/Exchange/Summary/utils';
import { ExchangeButtonProps } from '~/components/General/Button/ExchangeButton';

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
        poolBalanceLong: BigNumber,
        poolBalanceShort: BigNumber,
        isPreCommit: boolean,
    ) => void;
    handleModalClose: () => void;
} & ExchangeButtonProps;

const MintButton: React.FC<MintButtonProps> = ({
    swapState,
    swapDispatch,
    userBalances,
    pool,
    amountBN,
    commit,
    commitType,
    token,
    isLong,
    trackBuyAction,
    handleModalClose,
}) => {
    const { selectedPool, side, leverage, invalidAmount, balanceType } = swapState;
    const nextTokenPrice = useMemo(
        () => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()),
        [isLong, pool.longToken, pool.shortToken],
    );
    const expectedAmount = calcNumTokens(amountBN, nextTokenPrice);

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
                        handleModalClose();
                        trackBuyAction(
                            side,
                            leverage,
                            token.name,
                            pool.settlementToken.symbol,
                            expectedAmount,
                            amountBN,
                            userBalances.settlementToken.balance,
                            MintSourceEnum.tracer,
                            pool.longToken.supply,
                            pool.shortToken.supply,
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
                    pool.longToken.supply,
                    pool.shortToken.supply,
                    true,
                );
            }}
        >
            <span className="mr-2 inline-block">Mint Pool Tokens</span>
        </TracerMintButton>
    );
};

export default MintButton;

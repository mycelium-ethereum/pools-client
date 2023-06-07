import React, { useMemo, useContext } from 'react';
import { Transition } from '@headlessui/react';
import styled from 'styled-components';
import { Pool, PoolToken, SideEnum, NETWORKS } from '@tracer-protocol/pools-js';
import { MintSourceEnum } from '~/archetypes/BuyTokens/MintButton';
import { calcNumTokens } from '~/archetypes/Exchange/Summary/utils';
import { BrowseTableRowData } from '~/archetypes/Pools/state';
import { HiddenExpand } from '~/components/General';
import Button from '~/components/General/Button';
import { ExchangeButtonProps } from '~/components/General/Button/ExchangeButton';
import TimeLeft from '~/components/TimeLeft';
import { AnalyticsContext } from '~/context/AnalyticsContext';
import { useBigNumber } from '~/context/SwapContext';
import useExpectedCommitExecution from '~/hooks/useExpectedCommitExecution';
import { usePoolInstanceActions } from '~/hooks/usePoolInstanceActions';
import usePools from '~/hooks/usePools';
import MyceliumSVG from '~/public/img/logos/mycelium/logo_MYC_small.svg';

import { constructBalancerLink } from '~/utils/balancer';
import { toApproxCurrency } from '~/utils/converters';

export type EXButtonsProps = {
    amount: string;
    isLong: boolean;
    pool: Pool;
    side: SideEnum;
    token: PoolToken;
    leverage: number;
    market: string;
    poolTokens: BrowseTableRowData[];
    isInvalid: boolean;
    onButtonClick: () => void;
} & ExchangeButtonProps;

export const ExchangeButtons: React.FC<EXButtonsProps> = ({
    amount,
    isLong,
    pool,
    side,
    token,
    leverage,
    market,
    poolTokens,
    isInvalid,
    swapState,
    account,
    userBalances,
    onButtonClick,
}) => {
    const { pools } = usePools();
    const { approve } = usePoolInstanceActions();
    // Required for tracking trade actions
    const { trackBuyAction } = useContext(AnalyticsContext);
    const amountBN = useBigNumber(amount);

    const { selectedPool } = swapState;
    const { nextPoolState } = pools[selectedPool as string] || {};
    const { expectedLongTokenPrice, expectedShortTokenPrice } = nextPoolState || {};
    const tokenPrice = useMemo(
        () => (isLong ? expectedLongTokenPrice : expectedShortTokenPrice),
        [isLong, nextPoolState],
    );

    const balancerPrice = useMemo(
        () =>
            poolTokens && token && token.symbol
                ? isLong
                    ? poolTokens.filter((poolToken) => poolToken.address === token?.pool)[0]?.longToken?.balancerPrice
                    : poolTokens.filter((poolToken) => poolToken.address === token?.pool)[0]?.shortToken?.balancerPrice
                : NaN,
        [isLong, token, poolTokens, pool.longToken, pool.shortToken],
    );

    const expectedAmount = calcNumTokens(amountBN, tokenPrice);
    const expectedBalancerAmount = !isNaN(balancerPrice)
        ? calcNumTokens(amountBN, useBigNumber(balancerPrice.toString()))
        : useBigNumber('0');

    const isValidOnBalancer = isFinite(expectedBalancerAmount.toNumber());
    const isValidAmount = parseFloat(amount) > 0 && amount.length > 0;
    const sideIndicator = side === SideEnum.long ? 'L' : 'S';

    const receiveIn = useExpectedCommitExecution(pool.lastUpdate, pool.updateInterval, pool.frontRunningInterval);

    return (
        <StyledHiddenExpand defaultHeight={0} open={!isInvalid && !!receiveIn && account !== undefined}>
            <Transition
                show={!isInvalid}
                enter="transition-opacity duration-50 delay-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <BuyButtonContainer>
                    <BuyText>
                        Mint <b>{`${expectedAmount.toNumber().toFixed(3)}`}</b> tokens at{' '}
                        <b>{toApproxCurrency(tokenPrice, 5)}</b> in{' '}
                        <b>
                            <TimeLeft targetTime={receiveIn} />
                        </b>
                    </BuyText>
                    <MintButtonContainer isValidAmount={isValidAmount} account={account}>
                        {userBalances.settlementToken.approvedAmount?.gte(userBalances.settlementToken.balance) ||
                        !userBalances.settlementToken.approvedAmount.eq(0) ? (
                            <TracerMintButton onClick={onButtonClick} disabled={!isValidAmount}>
                                <span className="mr-2 inline-block">Mint on</span>
                                <MyceliumSVG className="w-[22px]" alt="Mycelium logo" />
                                <span className="font-medium ml-1 inline-block">Mycelium</span>
                            </TracerMintButton>
                        ) : (
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
                        )}
                    </MintButtonContainer>
                </BuyButtonContainer>
                <BuyButtonContainer>
                    <BuyText>
                        {isValidOnBalancer ? (
                            <>
                                Buy <b>{expectedBalancerAmount?.toNumber().toFixed(3)}</b> tokens at{' '}
                                <b>${balancerPrice && parseFloat(balancerPrice.toString()).toFixed(5)}</b> instantly
                            </>
                        ) : (
                            <>
                                There are no Balancer pools for the {leverage}
                                {sideIndicator}-{market} token yet.
                            </>
                        )}
                    </BuyText>
                    <BalancerBuyButton
                        onClick={() => {
                            trackBuyAction(
                                side,
                                leverage,
                                token.name,
                                pool.settlementToken.symbol,
                                expectedAmount,
                                amountBN,
                                userBalances.settlementToken.balance,
                                MintSourceEnum.balancer,
                                pool.longToken.supply,
                                pool.shortToken.supply,
                                true,
                            );
                            open(constructBalancerLink(token?.address, NETWORKS.ARBITRUM, true), '_blank');
                        }}
                        isValidOnBalancer={isValidOnBalancer}
                        isValidAmount={isValidAmount}
                        disabled={!isValidOnBalancer || !isValidAmount}
                    >
                        <span className="mr-2 inline-block">Take me to</span>
                        <img
                            className="w-[100px] text-theme-primary"
                            alt="tracer-logo"
                            src={'/img/logos/balancer/balancer_logo.svg'}
                        />
                    </BalancerBuyButton>
                </BuyButtonContainer>
            </Transition>
        </StyledHiddenExpand>
    );
};

export default ExchangeButtons;

const StyledHiddenExpand = styled(HiddenExpand)`
    margin-top: 0;
    margin-bottom: 16px;
    @media (min-width: 640px) {
        margin-bottom: 48px;
    }
`;

const BuyButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    width: 100%;
    background: var(--background);
    border-radius: 0.25rem;
    padding: 16px;
    color: var(--text);
    @media (min-width: 640px) {
        flex-direction: row;
        padding: 12px 12px 12px 16px;
    }
`;

const MintButtonContainer = styled.div<{
    isValidAmount: boolean;
    account?: string;
}>`
    position: relative;
    width: 220px;
    height: 56px;
    opacity: ${({ isValidAmount, account }) => (isValidAmount || !account ? '1' : '0.5')};
    cursor: ${({ isValidAmount, account }) => (isValidAmount || !account ? 'pointer' : 'not-allowed')};
    button {
        pointer-events: ${({ isValidAmount, account }) => (isValidAmount || !account ? 'auto' : 'none')};
    }
`;

export const TracerMintButton = styled.button<{ absolute?: boolean }>`
    position: ${({ absolute }) => (absolute ? 'absolute' : 'relative')};
    left: 0;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 13px 25px;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 0.25rem;
    color: white;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    z-index: 1;
`;

const BalancerBuyButton = styled.button<{
    isValidOnBalancer: boolean;
    isValidAmount: boolean;
}>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 13px 11px;
    width: 220px;
    height: 56px;
    border-radius: 0.25rem;
    border: 1px solid ${({ theme }) => theme.border.primary};
    color: #ffffff;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    opacity: ${({ isValidOnBalancer, isValidAmount }) => (isValidOnBalancer && isValidAmount ? '1' : '0.5')};
    cursor: ${({ isValidOnBalancer, isValidAmount }) =>
        isValidOnBalancer && isValidAmount ? 'default' : 'not-allowed'};
`;

const BuyText = styled.p`
    max-width: 235px;
    margin-right: 20px;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    margin-bottom: 16px;
    text-align: center;
    @media (min-width: 640px) {
        margin-bottom: 0;
        text-align: left;
    }
`;

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Pool, PoolToken, SideEnum, NETWORKS } from '@tracer-protocol/pools-js';
import { calcNumTokens } from '~/archetypes/Exchange/Summary/utils';
import { BrowseTableRowData } from '~/archetypes/Pools/state';
import MintButton from '~/archetypes/TokenBuySell/MintButton';
import { ExchangeButtonProps } from '~/components/General/Button/ExchangeButton';
import TimeLeft from '~/components/TimeLeft';
import { useBigNumber } from '~/context/SwapContext';
import { usePoolInstanceActions } from '~/hooks/usePoolInstanceActions';
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
    swapState,
    swapDispatch,
    account,
    handleConnect,
    userBalances,
    commitType,
}) => {
    const [mintButtonClicked, setMintButtonClicked] = useState(false);

    const handleClick = () => {
        setMintButtonClicked(true);
    };

    const { commit, approve } = usePoolInstanceActions();
    const amountBN = useBigNumber(amount);

    const tokenPrice = useMemo(
        () => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()),
        [isLong, pool.longToken, pool.shortToken],
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

    const nextTokenPrice = useMemo(
        () => (isLong ? pool.getNextLongTokenPrice() : pool.getNextShortTokenPrice()),
        [isLong, pool.longToken, pool.shortToken],
    );

    const expectedAmount = calcNumTokens(amountBN, nextTokenPrice);
    const expectedBalancerAmount = !isNaN(balancerPrice)
        ? calcNumTokens(amountBN, useBigNumber(balancerPrice.toString()))
        : useBigNumber('0');

    const isValidOnBalancer = isFinite(expectedBalancerAmount.toNumber());
    const sideIndicator = side === SideEnum.long ? 'L' : 'S';
    const timeLeft = useMemo(
        () => poolTokens.filter((poolToken) => poolToken.address === token?.pool)[0].expectedExecution,
        [poolTokens, token],
    );

    return (
        <>
            <BuyButtonContainer>
                <BuyText>
                    Mint <b>{`${expectedAmount.toNumber().toFixed(3)}`}</b> tokens at{' '}
                    <b>{toApproxCurrency(tokenPrice, 3)}</b> in{' '}
                    <b>
                        <TimeLeft targetTime={timeLeft} />
                    </b>
                </BuyText>
                <MintButtonContainer>
                    <TracerMintButton hidden={mintButtonClicked} onClick={handleClick}>
                        <span className="mr-2 inline-block">Mint on</span>
                        <img className="w-[90px]" alt="tracer-logo" src={'/img/logos/tracer/tracer_logo.svg'} />
                    </TracerMintButton>
                    <MintButton
                        swapState={swapState}
                        swapDispatch={swapDispatch}
                        account={account}
                        handleConnect={handleConnect}
                        userBalances={userBalances}
                        approve={approve}
                        pool={pool}
                        amountBN={amountBN}
                        commit={commit}
                        commitType={commitType}
                    />
                </MintButtonContainer>
            </BuyButtonContainer>
            <BuyButtonContainer>
                <BuyText>
                    {isValidOnBalancer ? (
                        <>
                            Buy <b>{expectedBalancerAmount?.toNumber().toFixed(3)}</b> tokens at{' '}
                            <b>${balancerPrice && parseFloat(balancerPrice.toString()).toFixed(3)}</b> instantly
                        </>
                    ) : (
                        <>
                            There are no Balancer pools for pool tokens tracking the {leverage}
                            {sideIndicator} {market} market yet.
                        </>
                    )}
                </BuyText>
                <BalancerBuyButton
                    onClick={() => open(constructBalancerLink(token?.address, NETWORKS.ARBITRUM, true), '_blank')}
                    className={isValidOnBalancer ? 'opacity-100' : 'cursor-not-allowed opacity-50'}
                    disabled={!isValidOnBalancer}
                >
                    <span className="mr-2 inline-block">Take me to</span>
                    <img className="w-[105px]" alt="tracer-logo" src={'/img/logos/balancer/balancer_logo.svg'} />
                </BalancerBuyButton>
            </BuyButtonContainer>
        </>
    );
};

export default ExchangeButtons;

const BuyButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    width: 100%;
    background: var(--background-secondary);
    border-radius: 8px;
    padding: 16px;
    color: var(--text);
    @media (min-width: 640px) {
        flex-direction: row;
        padding: 12px 12px 12px 16px;
    }
`;

const MintButtonContainer = styled.div`
    position: relative;
    width: 220px;
    height: 56px;
`;

const TracerMintButton = styled.button`
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 13px 25px;
    width: 100%;
    height: 100%;
    background: #3535dc;
    border-radius: 7px;
    color: white;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    z-index: 1;
`;

const BalancerBuyButton = styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 13px 11px;
    width: 220px;
    height: 56px;
    background: #16bdca;
    border-radius: 7px;
    color: white;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
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

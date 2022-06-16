import React, { useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { NETWORKS, BalanceTypeEnum, SideEnum } from '@tracer-protocol/pools-js';
import { isInvalidAmount } from '~/archetypes/Exchange/Inputs';
import AmountInput from '~/archetypes/Exchange/Inputs/AmountInput';
import ExchangeButtons from '~/archetypes/TokenBuySell/ExchangeButtons';
import { LeverageSelector, MarketDropdown, SideSelector } from '~/archetypes/TokenBuySell/Inputs';
import { Logo, tokenSymbolToLogoTicker } from '~/components/General';
import { CommitActionSideMap } from '~/constants/commits';
import { noDispatch, swapDefaults, SwapContext, useBigNumber } from '~/context/SwapContext';
import useBrowsePools from '~/hooks/useBrowsePools';
import { usePool } from '~/hooks/usePool';
import usePoolsNextBalances from '~/hooks/usePoolsNextBalances';
import { useStore } from '~/store/main';
import { selectWeb3Info, selectAccount, selectHandleConnect } from '~/store/Web3Slice';

const TokenBuySell: React.FC = () => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useContext(SwapContext);
    const { amount, leverage, market, markets, selectedPool, side, commitAction, balanceType, invalidAmount } =
        swapState || {};

    const account = useStore(selectAccount);
    const handleConnect = useStore(selectHandleConnect);

    const amountBN = useBigNumber(amount);
    const isLong = side === SideEnum.long;
    const { network = NETWORKS.ARBITRUM } = useStore(selectWeb3Info, shallow);
    const commitType = CommitActionSideMap[commitAction][side];

    const { poolInstance: pool, userBalances } = usePool(selectedPool);
    const { rows: poolTokens } = useBrowsePools();

    const token = useMemo(() => (isLong ? pool.longToken : pool.shortToken), [isLong, pool.longToken, pool.shortToken]);
    const tokenBalance = useMemo(() => {
        switch (balanceType) {
            case BalanceTypeEnum.escrow:
                return isLong ? userBalances.aggregateBalances.longTokens : userBalances.aggregateBalances.shortTokens;
            default:
                return isLong ? userBalances.longToken.balance : userBalances.shortToken.balance;
        }
    }, [
        isLong,
        balanceType,
        userBalances.longToken,
        userBalances.shortToken,
        userBalances.aggregateBalances.longTokens,
        userBalances.aggregateBalances.shortTokens,
    ]);

    const settlementTokenBalance = useMemo(() => {
        switch (balanceType) {
            case BalanceTypeEnum.escrow:
                return userBalances.aggregateBalances.settlementTokens;
            default:
                return userBalances.settlementToken.balance;
        }
    }, [balanceType, userBalances.settlementToken, userBalances.aggregateBalances.settlementTokens]);

    const nextBalances = usePoolsNextBalances(pool);
    const notional = useMemo(() => (isLong ? nextBalances.nextLongBalance : nextBalances.nextShortBalance), [isLong]);

    const pendingBurns = useMemo(
        () => (isLong ? pool.committer.pendingLong.burn : pool.committer.pendingShort.burn),
        [isLong, pool.committer.pendingLong.burn, pool.committer.pendingShort.burn],
    );

    useEffect(() => {
        if (pool) {
            const invalidAmount = isInvalidAmount(amountBN, settlementTokenBalance);

            swapDispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [commitAction, amount, notional, token, pendingBurns, settlementTokenBalance, tokenBalance]);

    const buyTableData = useMemo(
        () => [
            {
                name: 'Market',
                selector: <MarketDropdown market={market} markets={markets} swapDispatch={swapDispatch} />,
            },
            {
                name: 'Side',
                selector: <SideSelector side={side} swapDispatch={swapDispatch} />,
            },
            {
                name: 'Leverage',
                selector: (
                    <LeverageSelector
                        market={market}
                        markets={markets}
                        leverage={leverage}
                        swapDispatch={swapDispatch}
                    />
                ),
            },
            {
                name: 'Token to spend',
                selector: (
                    <AmountInput
                        invalidAmount={invalidAmount}
                        amount={amount}
                        amountBN={amountBN}
                        balance={settlementTokenBalance}
                        tokenSymbol={pool.settlementToken.symbol}
                        swapDispatch={swapDispatch}
                        selectedPool={selectedPool}
                        isPoolToken={false}
                    />
                ),
            },
            {
                name: 'Token to receive',
                selector: (
                    <TokenReceiveBox>
                        <Logo className="mr-2 inline" size="md" ticker={tokenSymbolToLogoTicker(token?.symbol)} />
                        {token?.symbol}
                    </TokenReceiveBox>
                ),
            },
        ],
        [
            network,
            market,
            markets,
            leverage,
            tokenBalance,
            swapDispatch,
            invalidAmount,
            amount,
            amountBN,
            side,
            pool,
            selectedPool,
        ],
    );

    return (
        <FormBackdrop>
            <Header>
                <H1>Get Leveraged Tokens</H1>
            </Header>
            <Divider />
            <Table>
                <tbody>
                    {/* Only show 'token to receive' row after user selection */}
                    {buyTableData.map((v, i) => {
                        if ((v.name === 'Token to receive' && token && token.symbol) || v.name !== 'Token to receive') {
                            return (
                                <TableRow key={`${v.name}-${i}`}>
                                    <TableCellLeft>{v.name}</TableCellLeft>
                                    <TableCellRight>{v.selector}</TableCellRight>
                                </TableRow>
                            );
                        }
                    })}
                </tbody>
            </Table>
            {poolTokens.length && token && token.symbol ? (
                <ExchangeButtons
                    account={account}
                    amount={amount}
                    pool={pool}
                    token={token}
                    isLong={isLong}
                    side={side}
                    leverage={leverage}
                    market={market}
                    poolTokens={poolTokens}
                    swapState={swapState}
                    swapDispatch={swapDispatch}
                    userBalances={userBalances}
                    amountBN={amountBN}
                    commitType={commitType}
                    handleConnect={handleConnect}
                    isInvalid={invalidAmount.isInvalid}
                />
            ) : null}
        </FormBackdrop>
    );
};

export default TokenBuySell;

const FormBackdrop = styled.section`
    background: var(--background);
    border-radius: 20px;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    font-family: 'Inter';
    padding: 16px;
    margin: 16px auto 32px;
    max-width: calc(100% - 20px);
    @media (min-width: 640px) {
        padding: 48px 48px 8px;
        margin: 63px auto 150px;
        max-width: 656px;
    }
`;

const Header = styled.header`
    margin-bottom: 16px;
`;

const H1 = styled.h1`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    color: var(--text);
`;

const Divider = styled.hr`
    border-top: 1px solid var(--border);
    margin-bottom: 32px;
`;

const Table = styled.table`
    width: 100%;
`;

const TableRow = styled.tr`
    display: flex;
    flex-direction: column;
    @media (min-width: 640px) {
        display: table-row;
    }
`;

const TableCellLeft = styled.td`
    display: flex;
    padding-top: 16px;
    min-width: 160px;
    height: 100%;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: var(--text);
    padding-bottom: 10px;
    @media (min-width: 640px) {
        padding-bottom: 40px;
    }
`;

const TableCellRight = styled.td`
    width: 100%;
    padding-bottom: 10px;
    @media (min-width: 640px) {
        padding-bottom: 40px;
    }
`;

const TokenReceiveBox = styled.div`
    width: 100%;
    height: 55px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px 20px;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    border-radius: 7px;
    margin-bottom: 20px;
    user-select: none;
    @media (min-width: 640px) {
        margin-bottom: 0px;
        padding-bottom: 0px;
    }
`;

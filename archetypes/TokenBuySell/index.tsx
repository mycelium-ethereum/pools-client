import React, { useContext, useEffect, useMemo } from 'react';
// import Link from 'next/link';
// import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { BalanceTypeEnum, SideEnum } from '@tracer-protocol/pools-js';
import { isInvalidAmount } from '~/archetypes/Exchange/Inputs';
import AmountInput from '~/archetypes/Exchange/Inputs/AmountInput';
import { LeverageSelector, MarketDropdown, SideSelector } from '~/archetypes/TokenBuySell/Inputs';
// import Button from '~/components/General/Button';
import TWButtonGroup from '~/components/General/TWButtonGroup';
// import { StyledTooltip } from '~/components/Tooltips';

import { noDispatch, swapDefaults, SwapContext, useBigNumber } from '~/context/SwapContext';
// import { useAllPoolLists } from '~/hooks/useAllPoolLists';
import { usePool } from '~/hooks/usePool';
import usePoolsNextBalances from '~/hooks/usePoolsNextBalances';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';

const TokenBuySell: React.FC = () => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useContext(SwapContext);
    const { amount, leverage, market, markets, selectedPool, side, commitAction, balanceType, invalidAmount } =
        swapState || {};
    const amountBN = useBigNumber(amount);
    const isLong = side === SideEnum.long;
    // const staticPoolInfo = useAllPoolLists();
    const { network = NETWORKS.ARBITRUM } = useStore(selectWeb3Info, shallow);
    // const handleConnect = useStore(selectHandleConnect);

    const { poolInstance: pool, userBalances } = usePool(selectedPool);

    // const valid = !Number.isNaN(leverage) && !!market && !Number.isNaN(side);

    // const hasBalancerPool = market && (market === 'ETH/USD' || market === 'BTC/USD');

    // const token = side === SideEnum.long ? pool?.longToken : pool?.shortToken;
    // const settlementTokens = staticPoolInfo.map((p) => p.settlementToken);

    // const uniqueTokens = [...new Map(settlementTokens.map((token) => [token?.symbol, token])).values()];

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

    // const button = () => {
    //     if (!account) {
    //         return (
    //             <Button size="lg" variant="primary" onClick={handleConnect}>
    //                 Connect Wallet
    //             </Button>
    //         );
    //     } else if (!valid) {
    //         return (
    //             <StyledTooltip title="Select the market, side, and power leverage you're after.">
    //                 <div>
    //                     <Button
    //                         size="lg"
    //                         variant="primary"
    //                         onClick={() =>
    //                             open(constructBalancerLink(token?.address, NETWORKS.ARBITRUM, true), '_blank')
    //                         }
    //                         disabled={true}
    //                     >
    //                         Take me to Balancer
    //                     </Button>
    //                 </div>
    //             </StyledTooltip>
    //         );
    //     } else if (!hasBalancerPool) {
    //         return (
    //             <StyledTooltip
    //                 title={
    //                     <>
    //                         {`There are no Balancer pools for pool tokens tracking the ${market} market yet. `}
    //                         <Link href="/pools">Mint/burn here.</Link>
    //                     </>
    //                 }
    //             >
    //                 <div>
    //                     <Button
    //                         size="lg"
    //                         variant="primary"
    //                         onClick={() =>
    //                             open(constructBalancerLink(token?.address, NETWORKS.ARBITRUM, true), '_blank')
    //                         }
    //                         disabled={true}
    //                     >
    //                         Take me to Balancer
    //                     </Button>
    //                 </div>
    //             </StyledTooltip>
    //         );
    //     } else {
    //         return (
    //             <Button
    //                 size="lg"
    //                 variant="primary"
    //                 onClick={() => open(constructBalancerLink(token?.address, NETWORKS.ARBITRUM, true), '_blank')}
    //                 disabled={!valid}
    //             >
    //                 Take me to Balancer
    //             </Button>
    //         );
    //     }
    // };

    return (
        <FormBackdrop>
            <Header>
                <H1>Get Leveraged Tokens</H1>
            </Header>
            <Divider />
            <Table>
                <tbody>
                    {buyTableData.map((v, i) => (
                        <TableRow key={`${v.name}-${i}`}>
                            <TableCellLeft>{v.name}</TableCellLeft>
                            <TableCellRight>{v.selector}</TableCellRight>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
            {/* Markets[selectedMarket][selectedLeverage] */}
            {/*
                <HiddenExpand
                    defaultHeight={0}
                    open={!!pool?.name}
                    className={classNames(
                        'border-2xl border bg-theme-background text-base',
                        !!pool?.name ? 'border-theme-border' : 'border-transparent',
                    )}
                >
                    <div className="border-box relative px-4 pt-4 pb-2">
                        <h2 className="text-theme-text">
                            <Logo className="mr-2 inline" size="md" ticker={tokenSymbolToLogoTicker(token?.symbol)} />
                            {token?.name}
                        </h2>
                        <div className={'absolute left-6 -top-4 z-[2] rounded bg-theme-background p-1.5 text-sm'}>
                            {'I want to trade'}
                        </div>
                    </div>
                </HiddenExpand>
                <div className="mt-8">{button()}</div> */}
        </FormBackdrop>
    );
};

export default TokenBuySell;

const FormBackdrop = styled.section`
    padding: 48px;
    background: var(--background);
    border-radius: 20px;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
    max-width: 656px;
    width: 100%;
    margin: 63px auto 0;
    font-family: 'Inter';
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
    border-top: 1px solid #e6e6e6;
    margin-bottom: 32px;
`;

const Table = styled.table`
    width: 100%;
`;

const TableRow = styled.tr``;

const TableCellLeft = styled.td`
    display: flex;
    padding-top: 16px;
    min-width: 160px;
    height: 100%;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: var(--text);
    padding-bottom: 40px;
`;

const TableCellRight = styled.td`
    width: 100%;
    padding-bottom: 40px;
`;

const TWButtonGroupStyled = styled(TWButtonGroup)`
    z-index: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.125rem;
    width: auto;
`;

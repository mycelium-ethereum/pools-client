import React, { useReducer, useMemo } from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';

import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';

import useEscrowHoldings from '~/hooks/useEscrowHoldings';
import { marketFilter } from '~/utils/filters';
import useBrowsePools from '~/hooks/useBrowsePools';
import { toApproxCurrency } from '~/utils/converters';
import useUserTokenOverview from '~/hooks/useUserTokenOverview';

import * as Styles from './styles';
import TokenTable from './TokenTable';
import EscrowTable from './EscrowTable';
import { portfolioReducer, initialPortfolioState, EscrowRowProps } from './state';
import { ConnectWalletBanner } from './ConnectWalletBanner';
import { TradeOverviewBanner } from './TradeOverviewBanner';
import { SkewCard } from './SkewCard';
import { HelpCard } from './HelpCard';
import { HoldingsTable } from './HoldingsTable';
import { emptyStateHelpCardContent } from './content';
import { PriceByDropDown, DenoteInDropDown, MarketDropdown, EscrowSearch } from './HoldingsTable/Actions';

export enum LoadingState {
    Idle = 0,
    Fetching = 1,
    HasFetched = 2,
}

export enum TimescaleEnum {
    AllTime = 'All Time',
}

export enum CurrencyEnum {
    USD = 'USD',
    AUD = 'AUD',
}

// const Overview
export default (({ onClickCommitAction }) => {
    const [state, dispatch] = useReducer(portfolioReducer, initialPortfolioState);
    const { rows } = useUserTokenOverview();
    const { rows: tokens } = useBrowsePools();
    const escrowRows = useEscrowHoldings();
    const { account } = useWeb3();
    const { handleConnect } = useWeb3Actions();

    const totalValuation = function () {
        let total = 0;
        for (let i = 0; i < rows.length; i++) {
            total = total + rows[i].holdings.times(rows[i].price).toNumber();
        }
        return total;
    };

    const maxSkew = tokens.sort((a, b) => b.longToken.effectiveGain - a.longToken.effectiveGain)[0];

    const searchFilter = (pool: EscrowRowProps): boolean => {
        const searchString = state.escrowSearch.toLowerCase();
        return Boolean(pool.poolName.toLowerCase().match(searchString));
    };

    const filteredEscrowRows = escrowRows
        .filter((pool: EscrowRowProps) => marketFilter(pool.poolName, state.escrowMarketFilter))
        .filter(searchFilter);

    const showFilledState = useMemo(() => {
        const isClaimable = filteredEscrowRows.some((v) => v.numClaimable === 1);
        const isHoldings = rows.some((v) => !v.holdings.eq(0));

        return isClaimable || isHoldings;
    }, [filteredEscrowRows, rows]);

    //TODO: calculate PnP and Net Acquisition Costs
    const portfolioOverview = [
        { title: 'Portfolio Valuation', value: toApproxCurrency(totalValuation()) },
        { title: 'Unrealised Profit and Loss', value: toApproxCurrency(totalValuation()) },
        { title: 'Net Acquisition Costs', value: toApproxCurrency(totalValuation()) },
    ];

    const emptyState = () => {
        return (
            <Styles.Container>
                <Styles.Wrapper isFullWidth={!!account}>
                    <TradeOverviewBanner title="Trade Portfolio Overview" content={portfolioOverview} />
                    {!account && <ConnectWalletBanner onClick={handleConnect} />}
                </Styles.Wrapper>
                <Styles.Wrapper isFullWidth={maxSkew === undefined}>
                    <Styles.Banner>
                        {emptyStateHelpCardContent.map((v, i) => (
                            <HelpCard
                                badge={v.badge}
                                title={v.title}
                                content={v.content}
                                href={v.href}
                                linkText={v.linkText}
                                key={`${v.title}-${i}`}
                            />
                        ))}
                    </Styles.Banner>
                    {maxSkew !== undefined && (
                        <div>
                            <SkewCard maxSkew={maxSkew} />

                            <HelpCard
                                title={`Skew Farming Opportunity: ${maxSkew?.name}`}
                                content={`Take a position in ${maxSkew?.name} and also take the opposite position of equal
                                magnitude on another platform.`}
                                href="https://tracer.finance/radar/skew-farming-explained/"
                                linkText="Learn how to skew farm"
                            />
                        </div>
                    )}
                </Styles.Wrapper>
            </Styles.Container>
        );
    };

    const filledState = () => {
        return (
            <Styles.Container>
                <Styles.Wrapper>
                    <TradeOverviewBanner title="Trade Portfolio Overview" content={portfolioOverview} />
                    <HelpCard
                        badge="Guide"
                        title="Minting and Burning Pool Tokens Guide"
                        content="A step-by-step on minting and burning tokens using the Perpetual Pools interface."
                        href="https://tracer.finance/radar/minting-burning/"
                        linkText="Read guide"
                    />
                </Styles.Wrapper>
                <HoldingsTable
                    title="Wallet Holdings"
                    firstActionTitle="Price by"
                    firstAction={<PriceByDropDown />}
                    secondActionTitle="Denote in"
                    secondAction={<DenoteInDropDown state={state} dispatch={dispatch} />}
                >
                    <TokenTable
                        rows={rows}
                        onClickCommitAction={onClickCommitAction}
                        denotedIn={state.positionsDenotedIn}
                    />
                </HoldingsTable>
                <HoldingsTable
                    title="Escrow Holdings"
                    firstActionTitle="Market"
                    firstAction={<MarketDropdown state={state} dispatch={dispatch} />}
                    secondAction={<EscrowSearch state={state} dispatch={dispatch} />}
                >
                    <EscrowTable rows={filteredEscrowRows} onClickCommitAction={onClickCommitAction} />
                </HoldingsTable>
            </Styles.Container>
        );
    };

    return <>{showFilledState ? filledState() : emptyState()}</>;
}) as React.FC<{
    onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
}>;

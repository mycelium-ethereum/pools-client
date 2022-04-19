import React, { useReducer, useMemo } from 'react';
import { calcNotionalValue, CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import Divider from '~/components/General/Divider';
import useBrowsePools from '~/hooks/useBrowsePools';
import useEscrowHoldings from '~/hooks/useEscrowHoldings';
import useUserTokenOverview from '~/hooks/useUserTokenOverview';
import { useStore } from '~/store/main';
import { selectAccount, selectHandleConnect } from '~/store/Web3Slice';
import { QueuedCommit } from '~/types/commits';
import { toApproxCurrency } from '~/utils/converters';
import { marketFilter } from '~/utils/filters';

import { ConnectWalletBanner } from './ConnectWalletBanner';
import { emptyStateHelpCardContent } from './content';
import EscrowTable from './EscrowTable';
import { HelpCard } from './HelpCard';
import { HistoricCommitsTable } from './HistoricCommits';
import { OverviewTable } from './OverviewTable';
import {
    PriceByDropDown,
    DenoteInDropDown,
    MarketDropdown,
    EscrowSearch,
    CommitTypeDropdown,
    QueuedCommitsSearch,
} from './OverviewTable/Actions';
import { QueuedCommitsTable } from './QueuedCommits';
import { SkewCard } from './SkewCard';
import { portfolioReducer, initialPortfolioState, EscrowRowProps, CommitTypeFilter } from './state';
import * as Styles from './styles';
import TokenTable from './TokenTable';
import { TradeOverviewBanner } from './TradeOverviewBanner';

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
export const Overview = ({
    onClickCommitAction,
    commits,
}: {
    onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
    commits: QueuedCommit[];
}): JSX.Element => {
    const account = useStore(selectAccount);
    const handleConnect = useStore(selectHandleConnect);

    const [state, dispatch] = useReducer(portfolioReducer, initialPortfolioState);
    const { rows } = useUserTokenOverview();
    const { rows: tokens } = useBrowsePools();
    const escrowRows = useEscrowHoldings();

    const totalValuation = function () {
        let total = 0;
        rows.forEach((row) => {
            total += row.holdings.times(row.price).toNumber();
        });

        escrowRows.forEach((pool) => {
            const valueInEscrow = calcNotionalValue(
                pool.claimableLongTokens.currentTokenPrice,
                pool.claimableLongTokens.balance,
            )
                .plus(calcNotionalValue(pool.claimableShortTokens.currentTokenPrice, pool.claimableShortTokens.balance))
                .plus(
                    calcNotionalValue(
                        pool.claimableSettlementTokens.currentTokenPrice,
                        pool.claimableSettlementTokens.balance,
                    ),
                );
            total += valueInEscrow.toNumber();
        });

        return total;
    };

    const maxSkew = tokens.sort((a, b) => b.longToken.effectiveGain - a.longToken.effectiveGain)[0];

    const escrowSearchFilter = (pool: EscrowRowProps): boolean => {
        const searchString = state.escrowSearch.toLowerCase();
        return Boolean(pool.poolName.toLowerCase().match(searchString));
    };

    const filteredEscrowRows = escrowRows
        .filter((pool: EscrowRowProps) => marketFilter(pool.poolName, state.escrowMarketFilter))
        .filter(escrowSearchFilter);

    const showFilledState = useMemo(() => {
        const isClaimable = filteredEscrowRows.some((v) => v.numClaimable >= 1);
        const isHoldings = rows.some((v) => !v.holdings.eq(0));
        return isClaimable || isHoldings;
    }, [filteredEscrowRows, rows]);

    //TODO: calculate PnP and Net Acquisition Costs
    const portfolioOverview = [
        { title: 'Portfolio Valuation', value: toApproxCurrency(totalValuation()) },
        // { title: 'Unrealised Profit and Loss', value: toApproxCurrency(totalValuation()) },
        // { title: 'Net Acquisition Costs', value: toApproxCurrency(totalValuation()) },
    ];

    const emptyState = () => {
        return (
            <>
                <Styles.Wrapper isFullWidth={!!account}>
                    <TradeOverviewBanner title="Trade Portfolio Overview" content={portfolioOverview} />
                    {!account && <ConnectWalletBanner handleConnect={handleConnect} />}
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
                            <SkewCard longToken={maxSkew.longToken} shortToken={maxSkew.shortToken} />

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
            </>
        );
    };

    const filledState = () => {
        return (
            <>
                <Styles.Wrapper>
                    <TradeOverviewBanner title="Trade Portfolio Overview" content={portfolioOverview} />
                    <HelpCard
                        badge="Roadmap"
                        title="Perpetual Pools V2 Roadmap"
                        content="Want to learn what is coming with the launch of V2?"
                        href="https://tracer.finance/radar/perpetual-pools-v2-roadmap/"
                        linkText="View V2 roadmap"
                    />
                </Styles.Wrapper>
                <OverviewTable
                    title="Pending"
                    subTitle="Your queued orders. Come back once they are processed to claim."
                    firstActionTitle="Commit Type"
                    firstAction={
                        <CommitTypeDropdown
                            selected={state.queuedCommitsFilter}
                            setCommitTypeFilter={(v) =>
                                void dispatch({ type: 'setQueuedCommitsFilter', filter: v as CommitTypeFilter })
                            }
                        />
                    }
                    secondAction={
                        <QueuedCommitsSearch
                            commitsSearch={state.queuedCommitsSearch}
                            setCommitsSearch={(search) => void dispatch({ type: 'setQueuedCommitsSearch', search })}
                        />
                    }
                >
                    <QueuedCommitsTable
                        commits={commits}
                        typeFilter={state.queuedCommitsFilter}
                        searchFilter={state.queuedCommitsSearch}
                    />
                </OverviewTable>
                <OverviewTable
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
                </OverviewTable>
                <OverviewTable
                    title="Escrow Holdings"
                    firstActionTitle="Market"
                    firstAction={<MarketDropdown state={state} dispatch={dispatch} />}
                    secondAction={<EscrowSearch state={state} dispatch={dispatch} />}
                >
                    <EscrowTable rows={filteredEscrowRows} onClickCommitAction={onClickCommitAction} />
                </OverviewTable>
                <Divider text="Historical Data" />
                <OverviewTable
                    title="Commit History"
                    subTitle="Your past orders."
                    firstActionTitle="Commit Type"
                    firstAction={
                        <CommitTypeDropdown
                            selected={state.historicCommitsFilter}
                            setCommitTypeFilter={(v) =>
                                void dispatch({ type: 'setHistoricCommitsFilter', filter: v as CommitTypeFilter })
                            }
                        />
                    }
                    secondAction={
                        <QueuedCommitsSearch
                            commitsSearch={state.historicCommitsSearch}
                            setCommitsSearch={(search) => void dispatch({ type: 'setHistoricCommitsSearch', search })}
                        />
                    }
                >
                    <HistoricCommitsTable
                        typeFilter={state.historicCommitsFilter}
                        searchFilter={state.historicCommitsSearch}
                    />
                </OverviewTable>
            </>
        );
    };

    return <>{showFilledState ? filledState() : emptyState()}</>;
};

export default Overview;

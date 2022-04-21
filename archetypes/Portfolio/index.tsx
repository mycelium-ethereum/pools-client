import React, { useReducer, useState } from 'react';
import { calcNotionalValue, CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import MintBurnModal from '~/archetypes/Pools/MintBurnModal';
import Divider from '~/components/General/Divider';
import { noDispatch, useSwapContext } from '~/context/SwapContext';
import useBrowsePools from '~/hooks/useBrowsePools';
import useEscrowHoldings from '~/hooks/useEscrowHoldings';
import usePendingCommits from '~/hooks/useQueuedCommits';
import useUserTokenOverview from '~/hooks/useUserTokenOverview';
import { useStore } from '~/store/main';
import { selectAccount, selectHandleConnect } from '~/store/Web3Slice';
import { MarketFilterEnum } from '~/types/filters';
import { toApproxCurrency } from '~/utils/converters';
import { marketFilter } from '~/utils/filters';

import ClaimedTokensTable from './ClaimedTokensTable';
import { ConnectWalletBanner } from './ConnectWalletBanner';
import { emptyStateHelpCardContent } from './content';
import EscrowTable from './EscrowTable';
import { HelpCard } from './HelpCard';
import { HistoricCommitsTable } from './HistoricCommits';
import { OverviewTable } from './OverviewTable';
import {
    DenoteInDropDown,
    MarketDropdown,
    EscrowSearch,
    CommitTypeDropdown,
    QueuedCommitsSearch,
} from './OverviewTable/Actions';
import { QueuedCommitsTable } from './QueuedCommits';
import { SkewCard } from './SkewCard';
import { portfolioReducer, initialPortfolioState, EscrowRowProps, CommitTypeFilter } from './state';
import { Container } from './styles';
import * as Styles from './styles';
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

export const PortfolioPage = (): JSX.Element => {
    const account = useStore(selectAccount);
    const handleConnect = useStore(selectHandleConnect);
    const { swapDispatch = noDispatch } = useSwapContext();
    const [state, dispatch] = useReducer(portfolioReducer, initialPortfolioState);
    const [mintBurnModalOpen, setMintBurnModalOpen] = useState(false);

    const { rows } = useUserTokenOverview();
    const { rows: tokens } = useBrowsePools();
    const escrowRows = useEscrowHoldings();
    const commits = usePendingCommits();

    const onClickCommitAction = (pool: string, side: SideEnum, action?: CommitActionEnum) => {
        swapDispatch({ type: 'setSelectedPool', value: pool });
        swapDispatch({ type: 'setSide', value: side });
        swapDispatch({ type: 'setCommitAction', value: action });
        setMintBurnModalOpen(true);
    };

    const handleModalClose = () => {
        setMintBurnModalOpen(false);
    };

    const totalValuation = function () {
        let total = 0;
        rows.forEach((row) => {
            total += row.balance.times(row.currentTokenPrice).toNumber();
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
                    <TradeOverviewBanner title="Portfolio Overview" content={portfolioOverview} account={!!account} />
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
                    <TradeOverviewBanner
                        title="Trade Portfolio Overview"
                        content={portfolioOverview}
                        account={!!account}
                    />
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
                    title="Claimed Tokens"
                    subTitle="Pools tokens in your wallet."
                    firstActionTitle="Markets"
                    firstAction={
                        <MarketDropdown
                            market={state.claimedTokensMarketFilter}
                            setMarket={(m) =>
                                void dispatch({ type: 'setClaimedTokensMarketFilter', market: m as MarketFilterEnum })
                            }
                        />
                    }
                    secondActionTitle="Denote in"
                    secondAction={<DenoteInDropDown state={state} dispatch={dispatch} />}
                >
                    <ClaimedTokensTable
                        rows={rows}
                        onClickCommitAction={onClickCommitAction}
                        denotedIn={state.positionsDenotedIn}
                    />
                </OverviewTable>
                <OverviewTable
                    title="Unclaimed Tokens"
                    subTitle="Your tokens, held with the Pool. Available to claim to a wallet at any time."
                    firstActionTitle="Market"
                    firstAction={
                        <MarketDropdown
                            market={state.escrowMarketFilter}
                            setMarket={(m) =>
                                void dispatch({ type: 'setEscrowMarketFilter', market: m as MarketFilterEnum })
                            }
                        />
                    }
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
                <Styles.BackgroundFade />
            </>
        );
    };

    return (
        <Container>
            <>{!!account ? filledState() : emptyState()}</>
            {mintBurnModalOpen && <MintBurnModal open={mintBurnModalOpen} onClose={handleModalClose} />}
        </Container>
    );
};

export default PortfolioPage;

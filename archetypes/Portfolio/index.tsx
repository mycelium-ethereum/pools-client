import React, { useReducer, useState } from 'react';
import { BalanceTypeEnum } from '@tracer-protocol/pools-js';
import MintBurnModal from '~/archetypes/Pools/MintBurnModal';
import Divider from '~/components/General/Divider';
import { noDispatch, useSwapContext } from '~/context/SwapContext';
import useBrowsePools from '~/hooks/useBrowsePools';
import usePortfolioOverview from '~/hooks/usePortfolioOverview';
import { useStore } from '~/store/main';
import { selectAccount, selectHandleConnect } from '~/store/Web3Slice';

import { ClaimedTokens } from './ClaimedTokensTable';
import { emptyStateHelpCardContent } from './content';
import { HelpCard } from './HelpCard';
import HistoricCommits from './HistoricCommits';
import QueuedCommits from './QueuedCommits';
import { SkewCard } from './SkewCard';
import { portfolioReducer, initialPortfolioState, OnClickCommit } from './state';
import { Container } from './styles';
import * as Styles from './styles';
import { TradeOverviewBanner } from './TradeOverviewBanner';
import UnclaimedTokens from './UnclaimedTokens';

export const PortfolioPage = (): JSX.Element => {
    const account = useStore(selectAccount);
    const handleConnect = useStore(selectHandleConnect);
    const { swapDispatch = noDispatch } = useSwapContext();
    const [state, dispatch] = useReducer(portfolioReducer, initialPortfolioState);
    const [mintBurnModalOpen, setMintBurnModalOpen] = useState(false);
    const portfolioOverview = usePortfolioOverview();
    const { rows: tokens } = useBrowsePools();

    const onClickCommitAction: OnClickCommit = (pool, side, action, unclaimed) => {
        swapDispatch({ type: 'setBalanceType', value: unclaimed ? BalanceTypeEnum.escrow : BalanceTypeEnum.wallet });
        swapDispatch({ type: 'setSelectedPool', value: pool });
        swapDispatch({ type: 'setSide', value: side });
        swapDispatch({ type: 'setCommitAction', value: action });
        setMintBurnModalOpen(true);
    };

    const handleModalClose = () => {
        setMintBurnModalOpen(false);
    };

    const maxSkew = tokens.sort((a, b) => b.longToken.effectiveGain - a.longToken.effectiveGain)[0];

    const emptyState = () => {
        return (
            <Styles.Wrapper>
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
                            roundedTop={false}
                        />
                    </div>
                )}
            </Styles.Wrapper>
        );
    };

    const filledState = () => {
        return (
            <>
                <QueuedCommits
                    queuedCommitsFilter={state.queuedCommitsFilter}
                    queuedCommitsSearch={state.queuedCommitsSearch}
                    dispatch={dispatch}
                />
                <ClaimedTokens
                    claimedTokensMarketFilter={state.claimedTokensMarketFilter}
                    claimedTokensSearch={state.claimedTokensSearch}
                    dispatch={dispatch}
                    onClickCommitAction={onClickCommitAction}
                />
                <UnclaimedTokens
                    escrowSearch={state.escrowSearch}
                    escrowMarketFilter={state.escrowMarketFilter}
                    dispatch={dispatch}
                    onClickCommitAction={onClickCommitAction}
                />
                <Divider text="Historical Data" />
                <HistoricCommits
                    historicCommitsFilter={state.historicCommitsFilter}
                    historicCommitsSearch={state.historicCommitsSearch}
                    dispatch={dispatch}
                />
            </>
        );
    };

    return (
        <Container>
            <TradeOverviewBanner
                title={'Portfolio Overview'}
                portfolioOverview={portfolioOverview}
                account={!!account}
                handleConnect={handleConnect}
            />
            <>{!!account ? filledState() : emptyState()}</>
            {mintBurnModalOpen && <MintBurnModal open={mintBurnModalOpen} onClose={handleModalClose} />}
        </Container>
    );
};

export default PortfolioPage;

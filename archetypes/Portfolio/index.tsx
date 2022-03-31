import React, { useState, useEffect, useReducer } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import MintBurnModal from '@archetypes/Pools/MintBurnModal';
import { browseReducer, BrowseState } from '@archetypes/Pools/state';
import Button from '@components/General/Button';
import { noDispatch, useSwapContext } from '@context/SwapContext';
import usePendingCommits from '~/hooks/useQueuedCommits';
import History from './History';
import Overview from './Overview';
import Queued from './Queued';

export enum PortfolioPage {
    TradePortfolio = 0,
    StakePortfolio = 1,
}

export enum TradePortfolioPage {
    Overview = 0,
    History = 1,
    Queued = 2,
}

export type PageOptions = {
    key: CommitActionEnum;
    text: React.ReactNode;
}[];

export const PortfolioNav: React.FC<{
    page: TradePortfolioPage;
    numCommits: number;
}> = ({ page, numCommits }) => {
    const router = useRouter();

    const overviewPage = page === TradePortfolioPage.Overview;
    const queuedPage = page === TradePortfolioPage.Queued;
    const historyPage = page === TradePortfolioPage.History;

    return (
        <div className="mt-5 flex overflow-x-auto whitespace-nowrap">
            <div className="mr-5">
                <Link href="/portfolio/">
                    <Button variant={overviewPage ? 'primary' : 'unselected'}>Overview</Button>
                </Link>
            </div>
            <div className="mr-5">
                <Button
                    variant={queuedPage ? 'primary' : 'unselected'}
                    onClick={() =>
                        router.push({
                            pathname: '/portfolio/commits',
                        })
                    }
                >
                    Pending Commits ({numCommits})
                </Button>
            </div>
            <div>
                <Button
                    variant={historyPage ? 'primary' : 'unselected'}
                    onClick={() =>
                        router.push({
                            pathname: '/portfolio/history',
                        })
                    }
                >
                    Commit History
                </Button>
            </div>
        </div>
    );
};

export default (({ page }) => {
    const [focus, setFocus] = useState<CommitActionEnum>(CommitActionEnum.mint);
    const router = useRouter();

    const { swapDispatch = noDispatch } = useSwapContext();
    const [state, dispatch] = useReducer(browseReducer, {
        mintBurnModalOpen: false,
    } as BrowseState);

    const commits = usePendingCommits();

    const handleCommitAction = (pool: string, side: SideEnum, action?: CommitActionEnum) => {
        swapDispatch({ type: 'setSelectedPool', value: pool });
        swapDispatch({ type: 'setSide', value: side });
        swapDispatch({ type: 'setCommitAction', value: action });
        dispatch({ type: 'setMintBurnModalOpen', open: true });
    };

    const handleModalClose = () => {
        dispatch({
            type: 'setMintBurnModalOpen',
            open: false,
        });
    };

    useEffect(() => {
        if (router.query.focus === 'burn') {
            setFocus(CommitActionEnum.burn);
        } else if (router.query.focus === 'mint') {
            setFocus(CommitActionEnum.mint);
        } else if (router.query.focus === 'flip') {
            setFocus(CommitActionEnum.flip);
        }
    }, [router]);

    const renderPage = (page: TradePortfolioPage) => {
        switch (page) {
            case TradePortfolioPage.History:
                return <History focus={focus} />;
            case TradePortfolioPage.Queued:
                return <Queued focus={focus} commits={commits} />;
            default:
                return <Overview onClickCommitAction={handleCommitAction} />;
        }
    };

    return (
        <div className="container">
            <PortfolioNav page={page} numCommits={commits.length} />
            {renderPage(page)}
            <MintBurnModal open={state.mintBurnModalOpen} onClose={handleModalClose} />
        </div>
    );
}) as React.FC<{
    page: TradePortfolioPage;
}>;

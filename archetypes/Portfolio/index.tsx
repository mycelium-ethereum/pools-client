import React, { useState, useEffect, useReducer } from 'react';
import History from './History';
import Overview from './Overview';
import Queued from './Queued';
import Link from 'next/link';
import Button from '@components/General/Button';
import { CommitActionEnum, CommitsFocusEnum, SideEnum } from '@libs/constants';
import { useRouter } from 'next/router';
import { noDispatch, useSwapContext } from '@context/SwapContext';
import { browseReducer, BrowseState } from '@archetypes/Pools/state';
import MintBurnModal from '@archetypes/Pools/MintBurnModal';
import usePendingCommits from '@libs/hooks/useQueuedCommits';

export enum PortfolioPage {
    TradePortfolio = 0,
    StakePortfolio = 1,
}

export enum TradePortfolioPage {
    Overview = 0,
    History = 1,
    Queued = 2,
}

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
                <Link href="/portfolio">
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
                    Pending Trades ({numCommits})
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
                    Trade History
                </Button>
            </div>
        </div>
    );
};

export default (({ page }) => {
    const [focus, setFocus] = useState<CommitsFocusEnum>(CommitsFocusEnum.mints);
    const router = useRouter();

    const { swapDispatch = noDispatch } = useSwapContext();
    const [state, dispatch] = useReducer(browseReducer, {
        mintBurnModalOpen: false,
    } as BrowseState);

    const commits = usePendingCommits();

    const handleBurn = (pool: string, side: SideEnum) => {
        swapDispatch({ type: 'setSelectedPool', value: pool });
        swapDispatch({ type: 'setSide', value: side });
        swapDispatch({ type: 'setCommitAction', value: CommitActionEnum.burn });
        dispatch({ type: 'setMintBurnModalOpen', open: true });
    };

    const handleModalClose = () => {
        dispatch({
            type: 'setMintBurnModalOpen',
            open: false,
        });
    };

    useEffect(() => {
        if (router.query.focus === 'burns') {
            setFocus(CommitsFocusEnum.burns);
        } else if (router.query.focus === 'mints') {
            setFocus(CommitsFocusEnum.mints);
        }
    }, [router]);

    const renderPage = (page: TradePortfolioPage) => {
        switch (page) {
            case TradePortfolioPage.History:
                return <History focus={focus} />;
            case TradePortfolioPage.Queued:
                return <Queued focus={focus} commits={commits} />;
            default:
                return <Overview onClickBurn={handleBurn} />;
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

import React, { useState, useEffect, useReducer } from 'react';
import History from './History';
import Overview from './Overview';
import Queued from './Queued';
import Link from 'next/link';
import Button from '@components/General/Button';
import { Dropdown } from '@components/General';
import { CommitActionEnum, CommitsFocusEnum, SideEnum } from '@libs/constants';
import { useRouter } from 'next/router';
import { noDispatch, useSwapContext } from '@context/SwapContext';
import { browseReducer, BrowseState } from '@archetypes/Pools/state';
import MintBurnModal from '@archetypes/Pools/MintBurnModal';

export enum PortfolioPage {
    TradePortfolio = 0,
    StakePortfolio = 1,
}

export enum TradePortfolioPage {
    Overview = 0,
    History = 1,
    Queued = 2,
}

const queuedOptions = [
    {
        key: CommitsFocusEnum.mints.toString(),
        text: 'Queued Mints',
    },
    {
        key: CommitsFocusEnum.burns.toString(),
        text: 'Queued Burns',
    },
];

const historyOptions = [
    {
        key: CommitsFocusEnum.mints.toString(),
        text: 'Mint History',
    },
    {
        key: CommitsFocusEnum.burns.toString(),
        text: 'Burn History',
    },
];

export const PortfolioNav: React.FC<{
    page: TradePortfolioPage;
    focus: CommitsFocusEnum;
}> = ({ page, focus }) => {
    const router = useRouter();

    const overviewPage = page === TradePortfolioPage.Overview;
    const queuedPage = page === TradePortfolioPage.Queued;
    const historyPage = page === TradePortfolioPage.History;

    return (
        <div className="flex mt-4">
            <div className="mx-4">
                <Link href="/portfolio">
                    <Button variant={overviewPage ? 'primary' : 'unselected'}>Overview</Button>
                </Link>
            </div>
            <div className="mx-4">
                <Dropdown
                    size="lg"
                    variant={queuedPage ? 'tracer' : 'unselected'}
                    value={queuedPage ? queuedOptions[focus].text : `Queued Trades (6)`}
                    options={queuedOptions}
                    onSelect={(val) => {
                        switch (parseInt(val)) {
                            case CommitsFocusEnum.burns:
                                router.push({
                                    pathname: '/portfolio/commits',
                                    query: {
                                        focus: 'burns',
                                    },
                                });
                                break;
                            default:
                                router.push({
                                    pathname: '/portfolio/commits',
                                    query: {
                                        focus: 'mints',
                                    },
                                });
                        }
                    }}
                />
            </div>
            <div className="mx-4">
                <Dropdown
                    size={'lg'}
                    variant={historyPage ? 'tracer' : 'unselected'}
                    value={historyPage ? historyOptions[focus].text : 'Trade History'}
                    options={historyOptions}
                    onSelect={(val) => {
                        switch (parseInt(val)) {
                            case CommitsFocusEnum.burns:
                                router.push({
                                    pathname: '/portfolio/history',
                                    query: {
                                        focus: 'burns',
                                    },
                                });
                                break;
                            default:
                                router.push({
                                    pathname: '/portfolio/history',
                                    query: {
                                        focus: 'mints',
                                    },
                                });
                        }
                    }}
                />
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
                return <Queued focus={focus} />;
            default:
                return <Overview onClickBurn={handleBurn} />;
        }
    };

    return (
        <div className="container">
            <PortfolioNav page={page} focus={focus} />
            {renderPage(page)}
            <MintBurnModal open={state.mintBurnModalOpen} onClose={handleModalClose} />
        </div>
    );
}) as React.FC<{
    page: TradePortfolioPage;
}>;

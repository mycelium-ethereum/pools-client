import React, { useState, useEffect } from 'react';
import History from './History';
import Overview from './Overview';
import Queued from './Queued';
import Link from 'next/link';
import Button from '@components/General/Button';
import { Dropdown } from '@components/General';
import { CommitsFocusEnum } from '@libs/constants';
import { useRouter } from 'next/router';
import { classNames } from '@libs/utils/functions';

export const PortfolioSideNav: React.FC<{
    page: PortfolioPage;
}> = ({ page }) => {
    return (
        <div className="flex flex-col w-1/5 p-4 bg-theme-background min-h-[80vh]">
            <div
                className={classNames(
                    page === PortfolioPage.TradePortfolio ? 'bg-tracer-100 dark:bg-cool-gray-800' : '',
                    'py-2 px-6 w-3/4 ml-auto mr-4 my-3 rounded-lg',
                )}
            >
                Trade Portfolio
            </div>
            <div
                className={classNames(
                    page === PortfolioPage.StakePortfolio ? 'bg-tracer-100 dark:bg-cool-gray-800' : '',
                    'py-2 pl-6 w-3/4 ml-auto mr-4 my-3 rounded-lg',
                )}
            >
                Stake Portfolio
            </div>
        </div>
    );
};

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
                return <Overview />;
        }
    };

    return (
        <div className="flex">
            <PortfolioSideNav page={PortfolioPage.TradePortfolio} />
            <div className="w-4/5">
                <PortfolioNav page={page} focus={focus} />
                {renderPage(page)}
            </div>
        </div>
    );
}) as React.FC<{
    page: TradePortfolioPage;
}>;

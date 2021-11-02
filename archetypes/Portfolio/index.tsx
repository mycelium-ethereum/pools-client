import React, { useState, useEffect } from 'react';
import History from './History';
import Overview from './Overview';
import Queued from './Queued';
import Link from 'next/link';
import Button from '@components/General/Button';
import { Dropdown } from '@components/General';
import { CommitsFocusEnum } from '@libs/constants';
import { useRouter } from 'next/router';

export const PortfolioSideNav: React.FC = () => {
    return (
        <div className="w-1/5 p-4 pr-8 bg-theme-background min-h-[80vh] text-right">
            <div>Trade Portfolio</div>
            <div>Strategise Portfolio</div>
        </div>
    );
};

export enum PortfolioPage {
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
    page: PortfolioPage;
    focus: CommitsFocusEnum;
}> = ({ page, focus }) => {
    const router = useRouter();

    const overviewPage = page === PortfolioPage.Overview;
    const queuedPage = page === PortfolioPage.Queued;
    const historyPage = page === PortfolioPage.History;

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

    const renderPage = (page: PortfolioPage) => {
        switch (page) {
            case PortfolioPage.History:
                return <History focus={focus} />;
            case PortfolioPage.Queued:
                return <Queued focus={focus} />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="flex">
            <PortfolioSideNav />
            <div className="w-4/5">
                <PortfolioNav page={page} focus={focus} />
                {renderPage(page)}
            </div>
        </div>
    );
}) as React.FC<{
    page: PortfolioPage;
}>;

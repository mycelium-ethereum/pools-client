import React, { useReducer } from 'react';
import { Dropdown, Logo, LogoTicker, tokenSymbolToLogoTicker } from '@components/General';
import TokenTable from './TokenTable';
import useUserTokenOverview from '@libs/hooks/useUserTokenOverview';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import useBrowsePools from '@libs/hooks/useBrowsePools';
import { SideEnum } from '@libs/constants';
import { toApproxCurrency } from '@libs/utils/converters';
import { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import styled from 'styled-components';

import CTABackground from '@public/img/cta-bg.svg';
import BVector from '@public/img/b-vector.svg';
import { MarketFilterEnum } from '@libs/types/General';
import { portfolioReducer, initialPortfolioState, DenotedInEnum, EscrowRowProps } from './state';
import { SearchInput } from '@components/General/SearchInput';
import useEscrowHoldings from '@libs/hooks/useEscrowHoldings';
import EscrowTable from './EscrowTable';
import { marketFilter } from '@libs/utils/functions';

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

enum PriceByEnum {
    Tracer = 'Tracer',
    Balancer = 'Balancer',
}

const TableSection = styled.div`
    border-radius: 0.75rem;
    margin-top: 2.5rem;
    padding: 1.25rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    background: ${({ theme }) => theme.background};
`;

// const Overview
export default (({ onClickBurn }) => {
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

    const emptyState = () => {
        return (
            <div className="mt-5">
                <div className="flex flex-col xl:flex-row">
                    <div className="xl:w-2/3 xl:mr-12 p-5 rounded-xl shadow-md bg-theme-background dark:bg-theme-background">
                        <div className="font-semibold text-2xl">Trade Portfolio Overview</div>
                        <div className="w-full mt-5 px-5 pt-10 pb-5 rounded-xl bg-cool-gray-50 dark:bg-theme-background-secondary">
                            <div className="font-bold text-2xl opacity-50">0.00</div>
                            <div className="font-bold text-md text-cool-gray-500 opacity-50">Portfolio Valuation</div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden xl:w-1/3 mt-5 xl:mt-0 p-5 rounded-xl shadow-md bg-tracer-50">
                        <CTABackground className="w-full absolute bottom-0 right-0" />
                        <div className="relative flex flex-col justify-center items-center p-5">
                            <div className="text-white mb-5 text-2xl text-center">
                                Connect to Arbitrum to get started with Perpetual Pools
                            </div>
                            <div
                                className="bg-blue-600 flex items-center justify-center rounded-lg h-12 w-48 text-white cursor-pointer"
                                onClick={handleConnect}
                            >
                                Connect Wallet
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex my-5 flex-col xl:flex-row">
                    <div className={`${maxSkew === undefined ? '' : 'xl:w-2/3 xl:mr-12'} flex flex-col xl:flex-row`}>
                        <div className="my-2 xl:w-1/3 xl:mr-5 px-4 py-6 rounded-xl shadow-md bg-tracer-50 dark:bg-theme-background">
                            <div className="w-min mb-3 px-3 py-1 text-sm text-white bg-tracer-900 rounded">TIP</div>
                            <div className="mb-3 text-2xl font-semibold">Earn TCR Now!</div>
                            <div className="mb-3">Do you hold pool tokens? Stake them now to earn APY in TCR!</div>
                            <a
                                href="https://pools.tracer.finance/stakepooltoken/"
                                target="_blank"
                                className="text-tracer-400 underline"
                                rel="noreferrer"
                            >
                                View staking pools
                            </a>
                        </div>
                        <div className="my-2 xl:w-1/3 xl:mr-5 px-4 py-6 rounded-xl shadow-md bg-tracer-50 dark:bg-theme-background">
                            <div className="w-min mb-3 px-3 py-1 text-sm text-white bg-tracer-900 rounded">GUIDE</div>
                            <div className="mb-3 text-2xl font-semibold">
                                Leveraged Token Designs: Compare the Market
                            </div>
                            <div className="mb-3">
                                {`Find out how Tracer's Pool tokens stack up to similar products and how you can benefit from the novel design.`}
                            </div>
                            <a
                                href="https://tracer.finance/radar/leveraged-tokens/"
                                target="_blank"
                                className="text-tracer-400 underline"
                                rel="noreferrer"
                            >
                                Read article
                            </a>
                        </div>
                        <div className="my-2 xl:w-1/3 px-4 py-6 rounded-xl shadow-md bg-tracer-50 dark:bg-theme-background">
                            <div className="w-min mb-3 px-3 py-1 text-sm text-white bg-tracer-900 rounded">GUIDE</div>
                            <div className="mb-3 text-2xl font-semibold">Skew Farming: How To</div>
                            <div className="mb-3">
                                Know this strategy to recognise opportunities for excess risk-adjusted returns. Take
                                advantage of the skew in Perpetual Pools.
                            </div>
                            <a
                                href="https://tracer.finance/radar/skew-farming-explained/"
                                target="_blank"
                                className="text-tracer-400 underline"
                                rel="noreferrer"
                            >
                                Read guide
                            </a>
                        </div>
                    </div>
                    {maxSkew === undefined ? null : (
                        <div className="my-2 xl:w-1/3 flex flex-col">
                            <div className="relative overflow-hidden rounded-t-xl">
                                <CTABackground className="w-full absolute bottom-0 right-0" />
                                <div className="relative flex">
                                    <div
                                        className="p-16"
                                        style={{
                                            background:
                                                'linear-gradient(90deg, rgba(0, 0, 0, 0.23) 6.59%, rgba(0, 0, 0, 0.73) 96.04%)',
                                        }}
                                    >
                                        <BVector />
                                    </div>
                                    <div className="m-auto">
                                        <div className="flex mb-5">
                                            <Logo
                                                size="lg"
                                                ticker={tokenSymbolToLogoTicker(maxSkew?.longToken?.symbol)}
                                                className="mr-5 my-auto"
                                            />
                                            <div className="my-auto text-white">
                                                <div>{maxSkew?.longToken?.symbol}</div>
                                                <div>
                                                    Leverage on gains: {maxSkew?.longToken?.effectiveGain.toFixed(3)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <Logo
                                                size="lg"
                                                ticker={tokenSymbolToLogoTicker(maxSkew?.shortToken?.symbol)}
                                                className="mr-5 my-auto"
                                            />
                                            <div className="my-auto text-white">
                                                <div>{maxSkew?.shortToken?.symbol}</div>
                                                <div>
                                                    Leverage on gains: {maxSkew?.shortToken?.effectiveGain.toFixed(3)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-6 rounded-b-xl shadow-md bg-tracer-50 dark:bg-theme-background">
                                <div className="mb-3 text-2xl font-semibold">
                                    Skew Farming Opportunity: {maxSkew?.name}
                                </div>
                                <div className="mb-3">
                                    Take a position in {maxSkew?.name} and also take the opposite position of equal
                                    magnitude on another platform.
                                </div>
                                <a
                                    href="https://tracer.finance/radar/skew-farming-explained/"
                                    target="_blank"
                                    className="text-tracer-400 underline"
                                    rel="noreferrer"
                                >
                                    Learn how to skew farm
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const filledState = () => {
        return (
            <div className="mt-5">
                <div className="flex flex-col xl:flex-row">
                    <div className="xl:w-2/3 xl:mr-12 p-5 rounded-xl shadow-md bg-theme-background dark:bg-theme-background">
                        <div className="font-semibold text-2xl">Trade Portfolio Overview</div>
                        <div className="w-full mt-5 px-5 pt-10 pb-5 rounded-xl bg-cool-gray-50 dark:bg-theme-background-secondary">
                            <div className="flex">
                                {/* <Logo size="md" ticker="USD" className="mr-1 my-auto" /> */}
                                <div className="font-bold text-2xl">{toApproxCurrency(totalValuation())}</div>
                            </div>
                            <div className="font-bold text-md text-cool-gray-500">Portfolio Valuation (USD)</div>
                        </div>
                    </div>
                    <div className="xl:w-1/3 mt-5 xl:mt-0 p-5 rounded-xl shadow-md bg-tracer-50 dark:bg-theme-background">
                        <div className="w-min mb-3 px-3 py-1 text-sm text-white bg-tracer-900 rounded">GUIDE</div>
                        <div className="mb-3 text-2xl font-semibold">Skew Farming: How To</div>
                        <div className="mb-3">
                            Know this strategy to recognise opportunities for excess risk-adjusted returns. Take
                            advantage of the skew in Perpetual Pools.
                        </div>
                        <a
                            href="https://tracer.finance/radar/skew-farming-explained/"
                            target="_blank"
                            className="text-tracer-400 underline"
                            rel="noreferrer"
                        >
                            Read guide
                        </a>
                    </div>
                </div>
                <TableSection>
                    <div className="sm:flex sm:justify-between whitespace-nowrap">
                        <div className="font-semibold text-2xl my-4">Token Holdings</div>
                        <div className="flex my-auto">
                            <div className="flex mr-2 sm:mr-5">
                                <div className="mr-2 my-auto">Price by</div>
                                <Dropdown
                                    size="sm"
                                    value="Tracer"
                                    options={[
                                        { key: PriceByEnum.Tracer },
                                        {
                                            key: PriceByEnum.Balancer,
                                            disabled: true,
                                            tooltip: { key: TooltipKeys.ComingSoon },
                                        },
                                    ]}
                                    onSelect={(val) => {
                                        console.debug(val);
                                    }}
                                />
                            </div>
                            <div className="flex">
                                <div className="mr-2 my-auto">Denote in</div>
                                <Dropdown
                                    size="sm"
                                    iconSize="xs"
                                    placeHolderIcon={state.positionsDenotedIn as LogoTicker}
                                    value={state.positionsDenotedIn}
                                    options={Object.keys(DenotedInEnum).map((key) => ({
                                        key: key,
                                        ticker: key as LogoTicker,
                                    }))}
                                    onSelect={(val) =>
                                        dispatch({ type: 'setDenotation', denotedIn: val as DenotedInEnum })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <TokenTable rows={rows} onClickBurn={onClickBurn} denotedIn={state.positionsDenotedIn} />
                </TableSection>
                <TableSection>
                    <div className="sm:flex sm:justify-between whitespace-nowrap">
                        <div className="font-semibold text-2xl my-4">Escrow Holdings</div>
                        <div className="flex my-auto">
                            <div className="flex mr-2 sm:mr-5">
                                <div className="mr-2 my-auto">Market</div>
                                <Dropdown
                                    size="sm"
                                    value={state.escrowMarketFilter}
                                    className="w-32 mt-auto"
                                    options={Object.keys(MarketFilterEnum).map((key) => ({
                                        key: (MarketFilterEnum as any)[key],
                                        ticker: (key !== 'All' ? key : '') as LogoTicker,
                                    }))}
                                    onSelect={(val) =>
                                        dispatch({ type: 'setEscrowMarketFilter', market: val as MarketFilterEnum })
                                    }
                                />
                            </div>
                            <div className="flex">
                                <SearchInput
                                    placeholder="Search"
                                    value={state.escrowSearch}
                                    onChange={(search) => dispatch({ type: 'setEscrowSearch', search })}
                                />
                            </div>
                        </div>
                    </div>
                    <EscrowTable rows={filteredEscrowRows} />
                </TableSection>
            </div>
        );
    };

    return <>{account ? filledState() : emptyState()}</>;
}) as React.FC<{
    onClickBurn: (pool: string, side: SideEnum) => void;
}>;

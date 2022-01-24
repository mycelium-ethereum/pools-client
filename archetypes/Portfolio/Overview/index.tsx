import { Dropdown, Logo, LogoTicker, tokenSymbolToLogoTicker } from '@components/General';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react'; // userReducer
import TokenTable from './TokenTable';
import useUserTokenOverview from '@libs/hooks/useUserTokenOverview';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import useBrowsePools from '@libs/hooks/useBrowsePools';
import { SideEnum } from '@libs/constants';
import { toApproxCurrency } from '@libs/utils/converters';
import { TooltipKeys } from '@components/Tooltips/TooltipSelector';

import CTABackground from '@public/img/cta-bg.svg';
import BVector from '@public/img/b-vector.svg';

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

export enum DenotedInEnum {
    BASE = 'BASE',
    USD = 'USD',
}

export type TokenRowProps = {
    poolAddress: string;
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    side: number;
    holdings: BigNumber;
    price: BigNumber;
    deposits: BigNumber; // amount of USDC deposited
    oraclePrice: BigNumber;
};

export interface PortfolioOverviewState {
    pnlHistorics: any[];
    loadingState: LoadingState;
    timeScale: TimescaleEnum;
    currency: CurrencyEnum;
}

export type OverviewAction =
    | { type: 'setPnlHistorics'; pnlHistorics: any[] }
    | { type: 'setTimescale'; timeScale: TimescaleEnum }
    | { type: 'setCurrency'; currency: CurrencyEnum }
    | { type: 'setLoadingState'; state: LoadingState }
    | { type: 'reset' };

export const initialOverviewState = {
    pnlHistorics: [],
    timeScale: TimescaleEnum.AllTime,
    currency: CurrencyEnum.AUD,
    loadingState: LoadingState.Fetching,
};

export const historicsReducer: (state: PortfolioOverviewState, action: OverviewAction) => PortfolioOverviewState = (
    state,
    action,
) => {
    switch (action.type) {
        case 'setPnlHistorics':
            return {
                ...state,
                pnlHistorics: action.pnlHistorics,
            };
        case 'setLoadingState':
            return {
                ...state,
                loadingState: action.state,
            };
        case 'setCurrency':
            return {
                ...state,
                currency: action.currency,
            };
        case 'setTimescale':
            return {
                ...state,
                timeScale: action.timeScale,
            };
        case 'reset':
            return {
                ...state,
                loadingState: LoadingState.Idle,
                commits: [],
            };
        default:
            throw new Error('Unexpected action');
    }
};

// const Overview
export default (({ onClickBurn }) => {
    // const [state, dispatch] = useReducer(historicsReducer, initialOverviewState);
    const { rows } = useUserTokenOverview();
    const { rows: tokens } = useBrowsePools();
    const { account } = useWeb3();
    const { handleConnect } = useWeb3Actions();
    const [denotedIn, setDenotedIn] = useState<DenotedInEnum>(DenotedInEnum.BASE);

    const totalValuation = function () {
        let total = 0;
        for (let i = 0; i < rows.length; i++) {
            total = total + rows[i].holdings.times(rows[i].price).toNumber();
        }
        return total;
    };

    const maxSkew = tokens.sort((a, b) => b.longToken.effectiveGain - a.longToken.effectiveGain)[0];

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
                <div className="mt-10 p-5 rounded-xl shadow-md bg-theme-background dark:bg-theme-background">
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
                                    placeHolderIcon={denotedIn as LogoTicker}
                                    value={denotedIn}
                                    options={Object.keys(DenotedInEnum).map((key) => ({
                                        key: key,
                                        ticker: key as LogoTicker,
                                    }))}
                                    onSelect={(val) => setDenotedIn(val as DenotedInEnum)}
                                />
                            </div>
                        </div>
                    </div>
                    <TokenTable rows={rows} onClickBurn={onClickBurn} denotedIn={denotedIn} />
                </div>
            </div>
        );
    };

    return <>{account ? filledState() : emptyState()}</>;
}) as React.FC<{
    onClickBurn: (pool: string, side: SideEnum) => void;
}>;

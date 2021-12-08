import { Dropdown } from '@components/General';
import BigNumber from 'bignumber.js';
import React, { useReducer } from 'react';
import TokenTable from './TokenTable';
import useUserTokenOverview from '@libs/hooks/useUserTokenOverview';

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

export type TokenRowProps = {
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    holdings: BigNumber;
    price: BigNumber;
    deposits: BigNumber; // amount of USDC deposited
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

const infoCard = 'xl:w-1/3 mr-4 my-2 px-16 py-10 rounded-xl bg-cool-gray-50 dark:bg-theme-background-secondary';

const overviewCard = 'xl:w-2/3 px-4 py-6 my-2 mx-4 rounded-xl shadow-md bg-theme-background dark:bg-theme-background';

const guideCard = 'sm:w-1/2 xl:w-1/3 px-4 py-6 my-2 mx-4 rounded-xl shadow-md bg-tracer-50 dark:bg-theme-background';

const mainCard = 'px-4 py-6 my-2 mx-4 rounded-xl shadow-md bg-theme-background dark:bg-theme-background';

// const Overview
export default (() => {
    const [state, dispatch] = useReducer(historicsReducer, initialOverviewState);
    const { rows } = useUserTokenOverview();

    return (
        <div className="mt-3">
            <div className="flex mb-5 flex-col xl:flex-row">
                <div className={overviewCard}>
                    <h1 className="relative text-theme-text text-xl mr-[20px]">
                        Trade Portfolio Overview
                        <div className="absolute right-0 top-0">
                            <Dropdown
                                className="mr-2"
                                size={'xs'}
                                value={state.timeScale.toString()}
                                options={Object.keys(TimescaleEnum).map((key) => ({
                                    key: key,
                                    text: TimescaleEnum[key as keyof typeof TimescaleEnum],
                                }))}
                                onSelect={(val) => dispatch({ type: 'setTimescale', timeScale: val as TimescaleEnum })}
                            />
                            <Dropdown
                                size={'xs'}
                                value={state.currency}
                                options={Object.keys(CurrencyEnum).map((key) => ({
                                    key: key,
                                    text: CurrencyEnum[key as keyof typeof CurrencyEnum],
                                }))}
                                onSelect={(val) => dispatch({ type: 'setCurrency', currency: val as CurrencyEnum })}
                            />
                        </div>
                    </h1>
                    <div className="flex flex-col lg:flex-row justify-between my-2">
                        <div className={infoCard}>
                            <div className="font-bold text-2xl">$400,000</div>
                            <div className="text-md">Portfolio Valuation</div>
                        </div>
                        <div className={infoCard}>
                            <div className="font-bold text-2xl">$40,000</div>
                            <div className="text-md">Unrealised Profit and Loss</div>
                        </div>
                        <div className={infoCard}>
                            <div className="font-bold text-2xl">$360,000</div>
                            <div className="text-md">Net Acquisition Costs</div>
                        </div>
                    </div>
                </div>
                <div className={guideCard}>
                    <div className="w-min mb-3 px-3 py-1 text-sm text-white bg-tracer-900 rounded">GUIDE</div>
                    <div className="mb-3 text-2xl font-semibold">Minting and Burning Pool Tokens Guide</div>
                    <div className="mb-3">
                        A step-by-step on minting and burning tokens using the Perpetual Pools interface.
                    </div>
                    <div className="text-tracer-400 underline">Read guide</div>
                </div>
            </div>
            <div className={mainCard}>
                <h1 className="text-theme-text text-xl">Token Holdings</h1>
                <TokenTable rows={rows} />
            </div>
        </div>
    );
}) as React.FC;

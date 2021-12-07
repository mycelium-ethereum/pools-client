import { Dropdown } from '@components/General';
import { classNames } from '@libs/utils/functions';
import BigNumber from 'bignumber.js';
import React, { useReducer } from 'react';
import PNLGraph from './PNLGraph';
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

enum KeyEnum {
    Deposits = 0,
    Profit = 1,
    Loss = 2,
}

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

const infoCard = 'mr-4 my-2 p-4 rounded-xl dark:bg-theme-background-secondary';

const mainCard = 'px-4 py-6 my-2 mx-4 rounded-xl dark:bg-theme-background';

// const Overview
export default (() => {
    const [state, dispatch] = useReducer(historicsReducer, initialOverviewState);
    const { rows } = useUserTokenOverview();

    return (
        <div>
            <div className={mainCard}>
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
                <div className="flex my-2">
                    <div className="w-1/5">
                        <div className={infoCard}>
                            <div className="font-bold text-xl">$400,000</div>
                            <div className="text-xs">Net value</div>
                        </div>
                        <div className={infoCard}>
                            <div className="font-bold text-xl">$360,000</div>
                            <div className="text-xs inline-flex justify-center">
                                <CircleKey className={`mr-1 bg-${COLOR_MAP[KeyEnum.Deposits]}`} /> Deposits
                            </div>
                        </div>
                        <div className={infoCard}>
                            <div className="font-bold text-xl">$360,000</div>
                            <div className="text-xs">
                                <span className="inline-flex justify-center">
                                    <CircleKey className={`mr-1 bg-${COLOR_MAP[KeyEnum.Profit]}`} /> Profits
                                </span>
                                <span className="ml-2 inline-flex justify-center">
                                    <CircleKey className={`mr-1 bg-${COLOR_MAP[KeyEnum.Loss]}`} /> Losses
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-4/5 flex flex-col">
                        <h3 className="text-theme-text text-base font-bold">Profits and Losses</h3>
                        <div className="h-full w-full">
                            <PNLGraph />
                        </div>
                    </div>
                </div>
            </div>
            <div className={mainCard}>
                <h1 className="text-theme-text text-xl">Token Holdings</h1>
                <TokenTable rows={rows} />
            </div>
        </div>
    );
}) as React.FC;

const COLOR_MAP: Record<KeyEnum, string> = {
    [KeyEnum.Loss]: 'red-500',
    [KeyEnum.Profit]: 'green-500',
    [KeyEnum.Deposits]: 'tracer-400',
};

const CircleKey: React.FC<{
    className?: string;
}> = ({ className }) => <div className={classNames(`rounded-full h-1 w-1 inline-block m-auto`, className ?? '')} />;

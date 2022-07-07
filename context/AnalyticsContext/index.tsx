import React, { createContext, FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import { Analytics, AnalyticsBrowser } from '@segment/analytics-next';
import { BalanceTypeEnum, CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { MintSourceEnum } from '~/archetypes/BuyTokens/MintButton';
import { StakeActionEnum } from '~/archetypes/Stake/FarmsTable';
import { networkConfig } from '~/constants/networks';
import { useStore } from '~/store/main';
import { selectAccount, selectNetwork } from '~/store/Web3Slice';

const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || '';
const POOLS_VERSION = 2;

// Helper functions
const convertBNToFloat = (bn: BigNumber) => {
    return parseFloat(BigNumber.max(bn).toString());
};

const useValues = () => {
    const account = useStore(selectAccount);
    const network = useStore(selectNetwork);
    const networkName = network ? networkConfig[network]?.name ?? 'Unsupported Network' : 'Unsupported Network';
    const [analytics, setAnalytics] = useState<Analytics | undefined>(undefined);
    const router = useRouter();

    const trackPageData = () => {
        analytics && analytics.page();
    };

    const trackLogin = () => {
        account &&
            analytics?.track('User logged in', {
                network: networkName,
                version: POOLS_VERSION,
            });
    };

    const getSideAsText = (side: SideEnum) => {
        switch (side) {
            case SideEnum.long:
                return `Long`;
            case SideEnum.short:
                return `Short`;
            default:
                return `Short`;
        }
    };

    const trackBuyAction = (
        side: SideEnum,
        leverage: number,
        tokenToBuy: string,
        tokenToSpend: string,
        tokenBuyAmount: BigNumber,
        tokenSpendAmount: BigNumber,
        balance: BigNumber,
        source: MintSourceEnum,
    ) => {
        const sideAsText = getSideAsText(side);
        const balanceAsFloat = convertBNToFloat(balance);
        const tokenBuyAmountAsFloat = convertBNToFloat(tokenBuyAmount);
        const tokenSpendAmountAsFloat = convertBNToFloat(tokenSpendAmount);

        account &&
            analytics?.track('Buy', {
                leverage: leverage,
                network: networkName,
                tokenToBuy: tokenToBuy,
                tokenToSpend: tokenToSpend,
                tokenBuyAmount: tokenBuyAmountAsFloat,
                tokenSpendAmount: tokenSpendAmountAsFloat,
                userBalance: balanceAsFloat,
                side: sideAsText,
                source: source,
                version: POOLS_VERSION,
                walletAddress: account,
            });
    };

    const getCommitActionAsText = (commitType: CommitActionEnum) => {
        switch (commitType) {
            case CommitActionEnum.mint:
                return `Mint`;
            case CommitActionEnum.burn:
                return `Burn`;
            case CommitActionEnum.flip:
                return `Flip`;
            default:
                return `Mint`;
        }
    };

    const getBalanceTypeAsText = (balanceType: BalanceTypeEnum) => {
        switch (balanceType) {
            case BalanceTypeEnum.wallet:
                return `Wallet`;
            case BalanceTypeEnum.escrow:
                return `Escrow`;
            default:
                return `Wallet`;
        }
    };

    const trackTradeAction = (
        commitType: CommitActionEnum,
        balanceType: BalanceTypeEnum,
        tokenToBuy: string,
        tokenToSpend: string,
        tokenBuyAmount: BigNumber,
        tokenSpendAmount: BigNumber,
        balance: BigNumber,
    ) => {
        const leverageAsNumber = parseInt(tokenToBuy.slice(0, 1));
        const balanceAsFloat = convertBNToFloat(balance);
        const tokenBuyAmountAsFloat = convertBNToFloat(tokenBuyAmount);
        const tokenSpendAmountAsFloat = convertBNToFloat(tokenSpendAmount);
        const commitAction = getCommitActionAsText(commitType);
        const source = getBalanceTypeAsText(balanceType);

        account &&
            analytics?.track('Trade', {
                action: commitAction,
                leverage: leverageAsNumber,
                network: networkName,
                tokenToBuy: tokenToBuy,
                tokenToSpend: tokenToSpend,
                tokenBuyAmount: tokenBuyAmountAsFloat,
                tokenSpendAmount: tokenSpendAmountAsFloat,
                userBalance: balanceAsFloat,
                source: source,
                version: POOLS_VERSION,
                walletAddress: account,
            });
    };

    const trackStakeAction = (stakeAction: StakeActionEnum, tokenName: string, amount: string, balance: BigNumber) => {
        const userBalance = convertBNToFloat(balance);

        account &&
            analytics?.track('Stake', {
                action: stakeAction,
                amount: amount,
                balance: userBalance,
                network: networkName,
                tokenName: tokenName,
                version: POOLS_VERSION,
                walletAddress: account,
            });
    };

    const identifyUser = () => {
        account &&
            analytics?.identify(account, {
                network: networkName,
                version: POOLS_VERSION,
            });
    };

    useEffect(() => {
        if (!writeKey) {
            console.warn('Segment.io write key not set');
        } else {
            const loadAnalytics = async () => {
                const [response] = await AnalyticsBrowser.load({ writeKey });
                setAnalytics(response);
            };
            loadAnalytics();
        }
    }, []);

    useEffect(() => {
        identifyUser();
    }, [account]);

    useEffect(() => {
        trackPageData();
    }, [analytics, router.asPath]);

    return {
        trackLogin,
        trackBuyAction,
        trackTradeAction,
        trackStakeAction,
    };
};

export const AnalyticsContext = createContext({} as ReturnType<typeof useValues>);

export const AnalyticsProvider: FC = ({ children }) => {
    return <AnalyticsContext.Provider value={useValues()}>{children}</AnalyticsContext.Provider>;
};

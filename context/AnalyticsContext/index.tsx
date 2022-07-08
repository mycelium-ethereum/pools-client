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

const POOLS_VERSION = 2;

// Helper functions
const convertBNToFloat = (bn: BigNumber) => {
    return parseFloat(BigNumber.max(bn).toString());
};

const getWriteKey = () => {
    switch (process.env.NODE_ENV) {
        case 'production':
            return process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY_PROD;
        case 'development':
            return process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY_DEV;
        default:
            return process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY_DEV;
    }
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
        poolBalanceLong: BigNumber,
        poolBalanceShort: BigNumber,
        isPreCommit: boolean,
    ) => {
        try {
            const actionStage = isPreCommit ? 'preCommitBuy' : 'postCommitBuy';
            const sideAsText = getSideAsText(side);
            const balanceAsFloat = convertBNToFloat(balance);
            const tokenBuyAmountAsFloat = convertBNToFloat(tokenBuyAmount);
            const tokenSpendAmountAsFloat = convertBNToFloat(tokenSpendAmount);
            const poolBalanceLongAsFloat = convertBNToFloat(poolBalanceLong);
            const poolBalanceShortAsFloat = convertBNToFloat(poolBalanceShort);
            const balanceAttr = isPreCommit
                ? { preCommitBalance: balanceAsFloat }
                : { postCommitBalance: balanceAsFloat };

            account &&
                analytics?.track(actionStage, {
                    leverage: leverage,
                    network: networkName,
                    poolBalanceLong: poolBalanceLongAsFloat,
                    poolBalanceShort: poolBalanceShortAsFloat,
                    tokenToBuy: tokenToBuy,
                    tokenToSpend: tokenToSpend,
                    tokenBuyAmount: tokenBuyAmountAsFloat,
                    tokenSpendAmount: tokenSpendAmountAsFloat,
                    userBalance: balanceAsFloat,
                    ...balanceAttr,
                    side: sideAsText,
                    source: source,
                    version: POOLS_VERSION,
                    walletAddress: account,
                });
        } catch (err) {
            console.error('Failed to send Buy action to Segment', err);
        }
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
        poolBalanceLong: BigNumber,
        poolBalanceShort: BigNumber,
        isPreCommit: boolean,
    ) => {
        const actionStage = isPreCommit ? 'preCommitTrade' : 'postCommitTrade';

        try {
            const leverageAsNumber = parseInt(tokenToBuy.slice(0, 1));
            const balanceAsFloat = convertBNToFloat(balance);
            const tokenBuyAmountAsFloat = convertBNToFloat(tokenBuyAmount);
            const tokenSpendAmountAsFloat = convertBNToFloat(tokenSpendAmount);
            const commitAction = getCommitActionAsText(commitType);
            const source = getBalanceTypeAsText(balanceType);
            const poolBalanceLongAsFloat = convertBNToFloat(poolBalanceLong);
            const poolBalanceShortAsFloat = convertBNToFloat(poolBalanceShort);
            const balanceAttr = isPreCommit
                ? { preCommitBalance: balanceAsFloat }
                : { postCommitBalance: balanceAsFloat };

            account &&
                analytics?.track(actionStage, {
                    action: commitAction,
                    leverage: leverageAsNumber,
                    network: networkName,
                    poolBalanceLong: poolBalanceLongAsFloat,
                    poolBalanceShort: poolBalanceShortAsFloat,
                    tokenToBuy: tokenToBuy,
                    tokenToSpend: tokenToSpend,
                    tokenBuyAmount: tokenBuyAmountAsFloat,
                    tokenSpendAmount: tokenSpendAmountAsFloat,
                    ...balanceAttr,
                    source: source,
                    version: POOLS_VERSION,
                    walletAddress: account,
                });
        } catch (err) {
            console.error('Failed to send Trade action to Segment', err);
        }
    };

    const trackStakeAction = (
        stakeAction: StakeActionEnum,
        tokenName: string,
        amount: string,
        amountUSD: string,
        balance: BigNumber,
        isPreCommit: boolean,
    ) => {
        const actionStage = isPreCommit ? 'preCommitStake' : 'postCommitStake';

        try {
            const balanceAsFloat = convertBNToFloat(balance);
            const balanceAttr = isPreCommit
                ? { preCommitBalance: balanceAsFloat }
                : { postCommitBalance: balanceAsFloat };

            account &&
                analytics?.track(actionStage, {
                    action: stakeAction,
                    amount: amount,
                    amountUSD: amountUSD,
                    ...balanceAttr,
                    network: networkName,
                    tokenName: tokenName,
                    version: POOLS_VERSION,
                    walletAddress: account,
                });
        } catch (err) {
            console.error('Failed to send Stake action to Segment', err);
        }
    };

    const identifyUser = () => {
        try {
            account &&
                analytics?.identify(account, {
                    network: networkName,
                    version: POOLS_VERSION,
                });
        } catch (err) {
            console.error('Failed to send Identify action to Segment', err);
        }
    };

    useEffect(() => {
        const writeKey = getWriteKey();
        if (!writeKey) {
            console.warn('Segment.io write key not set');
        } else {
            const currentUrl = window.location.href;
            if (currentUrl && !currentUrl.includes(process.env.siteUrl as string)) {
                const loadAnalytics = async () => {
                    const [response] = await AnalyticsBrowser.load({ writeKey });
                    setAnalytics(response);
                };
                loadAnalytics();
            }
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

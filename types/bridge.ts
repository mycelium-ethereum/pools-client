import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { ARBITRUM_RINKEBY, ARBITRUM, MAINNET, RINKEBY } from '@constants/networks';
import { LogoTicker } from '@components/General';

export type DestinationNetwork = typeof RINKEBY | typeof ARBITRUM_RINKEBY | typeof MAINNET | typeof ARBITRUM;

export type BridgeableAssetWarnings = {
    [networkId: string]: {
        [ticker: string]: { getWarningText: ({ amount }: { amount: BigNumber }) => string | null };
    };
};

export type BridgeableAsset = {
    name: string;
    symbol: LogoTicker;
    address: string | null;
    decimals: number;
    displayDecimals: number;
};

export type BridgeableAssets = {
    [networkId: string]: BridgeableAsset[];
};

export type BridgeableBalance = {
    balance: BigNumber;
    allowance: BigNumber;
    spender: string; // address that allowance corresponds to
};

export type BridgeableBalances = { [network: string]: { [account: string]: { [symbol: string]: BridgeableBalance } } };

export type BridgeProviders = { [network: string]: ethers.providers.JsonRpcProvider };

import { SetState, GetState } from 'zustand';
import { IENSSlice } from './ENSSlice/types';
import { IGasSlice } from './GasSlice/types';
import { IMarketSpotPricesSlice } from './MarketSpotPricesSlice/types';
import { IPendingCommitSlice } from './PendingCommitSlice/types';
import { IPoolsInstancesSlice } from './PoolInstancesSlice/types';
import { IPoolsSlice } from './PoolsSlice/types';
import { IPoolsV1Slice } from './PoolsV1Slice/types';
import { IThemeSlice } from './ThemeSlice/types';
import { ITransactionSlice } from './TransactionSlice/types';
import { IUnsupportedNetworkSlice } from './UnsupportedNetworkSlice/types';
import { IWeb3Slice } from './Web3Slice/types';

// global store state
export type StoreState = {
    transactionSlice: ITransactionSlice;
    themeSlice: IThemeSlice;
    poolsSlice: IPoolsSlice;
    poolsV1Slice: IPoolsV1Slice;
    poolsInstancesSlice: IPoolsInstancesSlice;
    web3Slice: IWeb3Slice;
    gasSlice: IGasSlice;
    unsupportedNetworkSlice: IUnsupportedNetworkSlice;
    pendingCommitSlice: IPendingCommitSlice;
    ensSlice: IENSSlice;
    marketSpotPricesSlice: IMarketSpotPricesSlice;
};

// Seperated return type to allow for a different
//  eg a slice with no lends would be StateSlice<StoreState, INoLensSlice>
//  since it receives a StoreState get and set but does not have to return the entire store state
// eslint-disable-next-line @typescript-eslint/ban-types
export type StateSlice<T extends object> = (set: SetState<T>, get: GetState<T>) => T;

export type StoreNetwork = StoreState['web3Slice']['network'];
export type StoreAccount = StoreState['web3Slice']['account'];

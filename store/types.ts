import { SetState, GetState } from 'zustand';
import { ITransactionSlice } from './TransactionSlice/types';
import { IThemeSlice } from './ThemeSlice/types';
import { IPoolsSlice } from './PoolsSlice/types';
import { IWeb3Slice } from './Web3Slice/types';
import { IGasSlice } from './GasSlice/types';
import { IUnsupportedNetworkSlice } from './UnsupportedNetworkSlice/types';
import { IPendingCommitSlice } from './PendingCommitSlice/types';

// global store state
export type StoreState = {
    transactionSlice: ITransactionSlice;
    themeSlice: IThemeSlice;
    poolsSlice: IPoolsSlice;
    web3Slice: IWeb3Slice;
    gasSlice: IGasSlice;
    unsupportedNetworkSlice: IUnsupportedNetworkSlice;
    pendingCommitSlice: IPendingCommitSlice;
};

// Seperated return type to allow for a different
//  eg a slice with no lends would be StateSlice<StoreState, INoLensSlice>
//  since it receives a StoreState get and set but does not have to return the entire store state
// eslint-disable-next-line @typescript-eslint/ban-types
export type StateSlice<T extends object> = (set: SetState<T>, get: GetState<T>) => T;

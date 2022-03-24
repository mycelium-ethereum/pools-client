import { GetState, SetState } from 'zustand';
import { ITransactionSlice } from './TransactionSlice/types';
import { IThemeSlice } from './ThemeSlice/types';

export type StoreState = ITransactionSlice & IThemeSlice;

export type StoreSlice<T> = (set: SetState<StoreState>, get: GetState<StoreState>) => T;

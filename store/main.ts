import create from 'zustand';
import { createTransactionSlice } from './TransactionSlice';
import { createThemeSlice } from './ThemeSlice';
import { StoreState } from './types';

export const useStore = create<StoreState>((set, get) => ({
    ...createTransactionSlice(set, get),
    ...createThemeSlice(set, get),
}));

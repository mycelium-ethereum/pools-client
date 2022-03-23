import create from 'zustand';
import { StateFromFunctions } from './types';
import { createTransactionSlice } from './TransactionSlice';

type State = StateFromFunctions<[typeof createTransactionSlice]>;

export const useStore = create<State>((set, get) => ({
    ...createTransactionSlice(set, get),
}));

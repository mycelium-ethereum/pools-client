import { toast } from 'react-toastify';
import { StateSlice, StoreState } from '@store/types';
import { transactionMap } from './transactions';
import { ITransactionSlice } from './types';

export const createTransactionSlice: StateSlice<ITransactionSlice, ITransactionSlice> = (set) => ({
    pendingCount: 0,
    handleTransaction: async ({ callMethod, params, type, injectedProps, callBacks }) => {
        const steps = transactionMap[type];

        const toastId = toast.loading(...steps.pending(injectedProps));

        // incremement count
        set((prev) => ({ pendingCount: prev.pendingCount + 1 }));

        // call method
        try {
            // @ts-ignore
            const contractTransaction = await callMethod(...params);

            try {
                // call optional callback
                callBacks?.afterConfirmation ? callBacks?.afterConfirmation(contractTransaction.hash) : null;
            } catch (error) {
                throw `After confirmation callback failed ${error}`;
            }
            try {
                const contractReceipt = await contractTransaction.wait();
                toast.update(toastId, steps.success(injectedProps));

                set((prev) => ({ pendingCount: prev.pendingCount - 1 }));

                try {
                    // call optional callback
                    callBacks?.onSuccess ? callBacks.onSuccess(contractReceipt) : null;
                } catch (error) {
                    throw `Success callback failed ${error}`;
                }
            } catch (error) {
                throw `Failed waiting for contractTransaction ${error}`;
            }
        } catch (error: any) {
            console.error('Failed transaction', error, error?.code);
            toast.update(toastId, steps.error({ props: injectedProps, error }));
            set((prev) => ({ pendingCount: prev.pendingCount - 1 }));
            try {
                callBacks?.onError ? callBacks.onError(error) : null;
            } catch (error) {
                throw `Error callback failed ${error}`;
            }
        }
    },
});

export const selectHandleTransaction: (state: StoreState) => ITransactionSlice['handleTransaction'] = (state) =>
    state.transactionSlice.handleTransaction;
export const selectPendingCount: (state: StoreState) => ITransactionSlice['pendingCount'] = (state) =>
    state.transactionSlice.pendingCount;

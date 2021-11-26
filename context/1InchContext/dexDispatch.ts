
export enum TransactionState {
    idle = 0,
    fetchingTrade = 1,
    fetchedTrade = 2,
    waitingForSignature = 3,
}

export type DexState = {
    txnState: TransactionState;
    usdcApproved: boolean;
    checkingAllowance: boolean;
};


export const initialDexState: DexState = {
    txnState: TransactionState.idle,
    usdcApproved: false,
    checkingAllowance: false
};

export type DexAction =
    | { type: 'setState'; state: TransactionState }
    | { type: 'setApproved'; approved: boolean}
    | { type: 'setCheckingAllowance'; checking: boolean }

export const reducer: (state: DexState, action: DexAction) => DexState = (state, action) => {
    switch (action.type) {
        case 'setState': {
            return ({
                ...state,
                txnState: action.state
            })
        }
        case 'setApproved': {
            return ({
                ...state,
                usdcApproved: action.approved
            })
        }
        case 'setCheckingAllowance': {
            return ({
                ...state,
                checkingAllowance: action.checking
            })
        }
        default:
            throw new Error('Unexpected action');
    }
};

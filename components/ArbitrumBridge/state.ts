export enum BridgeStepEnum {
    Collateral,
    Gas,
}

export interface BridgeState {
    step: BridgeStepEnum;
    USDCAmount?: number;
    ETHAmount?: number;
    isBridging: boolean;
}

export type BridgeAction =
    | { type: 'setStep'; step: BridgeStepEnum }
    | { type: 'setUSDC'; amount: number | undefined }
    | { type: 'setETH'; amount: number | undefined }
    | { type: 'setBridging'; status: boolean }
<<<<<<< HEAD
    | { type: 'setApproving'; status: boolean }
=======
>>>>>>> 26383deaef3b327ff9894474319ed1106e54e8e0
    | { type: 'reset' };

export const DefaultBridgeState: BridgeState = {
    step: BridgeStepEnum.Collateral,
    isBridging: false,
};

export const bridgeReducer: (state: BridgeState, action: BridgeAction) => BridgeState = (state, action) => {
    switch (action.type) {
        case 'setStep': {
            return {
                ...state,
                step: action.step,
            };
        }
        case 'setUSDC': {
            return {
                ...state,
                USDCAmount: action.amount,
            };
        }
        case 'setETH': {
            return {
                ...state,
                ETHAmount: action.amount,
            };
        }
        case 'setBridging': {
            return {
                ...state,
                isBridging: action.status,
            };
        }
<<<<<<< HEAD
        case 'setApproving': {
            return {
                ...state,
                isApproving: action.status,
            };
=======
        case 'reset': {
            return DefaultBridgeState;
>>>>>>> 26383deaef3b327ff9894474319ed1106e54e8e0
        }
        case 'reset': {
            return DefaultBridgeState;
        }
        default:
            throw new Error('Unexpected action');
    }
};

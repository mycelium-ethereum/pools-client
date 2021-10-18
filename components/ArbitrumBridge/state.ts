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
    | { type: 'setApproving'; status: boolean }
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
        case 'setApproving': {
            return {
                ...state,
                isApproving: action.status,
            };
        }
        case 'reset': {
            return DefaultBridgeState;
        }
        default:
            throw new Error('Unexpected action');
    }
};

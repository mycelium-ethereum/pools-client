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
    | { type: 'setBridging'; status: boolean };

export const bridgeReducer: (state: BridgeState, action: BridgeAction) => BridgeState = (state, action) => {
    console.log(action);
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
        default:
            throw new Error('Unexpected action');
    }
};

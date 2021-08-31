export const ETH_ARB = 0;
export const ARB_ETH = 1;

export type Direction = typeof ETH_ARB | typeof ARB_ETH;

export const USDC = 0;
export const ETH = 1;
export const TOKEN_MAP = {
    [USDC]: {
        name: 'USDC',
        address: '',
    },
    [ETH]: {
        name: 'ETH',
        address: '',
    },
};

export type BridgeTokenType = typeof USDC | typeof ETH;
export type BridgeState = {
    amount: number;
    open: boolean;
    selectedToken: BridgeTokenType;
    direction: Direction;
};

export type BridgeAction =
    | { type: 'setAmount'; amount: number }
    | { type: 'setSelectedToken'; token: BridgeTokenType }
    | { type: 'setDirection'; direction: Direction }
    | { type: 'setOpen'; value: boolean }
    | { type: 'setLoading'; loading: boolean };

export const bridgeReducer: (state: BridgeState, action: BridgeAction) => BridgeState = (state, action) => {
    switch (action.type) {
        case 'setAmount': {
            return {
                ...state,
                amount: action.amount,
            };
        }
        case 'setSelectedToken': {
            return {
                ...state,
                selectedToken: action.token,
            };
        }
        case 'setDirection': {
            return {
                ...state,
                direction: action.direction,
            };
        }
        case 'setLoading': {
            return {
                ...state,
                loading: action.loading,
            };
        }
        case 'setOpen': {
            return {
                ...state,
                open: action.value,
            };
        }
        default:
            throw new Error('Unexpected action');
    }
};

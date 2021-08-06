// import { BigNumber, ethers } from 'ethers';
import { LeveragedPool } from '@libs/types/contracts';

export type TokenState = {
    contract: LeveragedPool | undefined;
	longTokenName: string,
	shortTokenName: string,
};

export const initialTokenState: TokenState = {
    contract: undefined,
	longTokenName: '',
	shortTokenName: '',
};

export type TokenAction = 
    | { type: 'setNames'; longToken: string, shortToken: string }
    | { type: 'setContract'; contract: any };

export const tokenReducer = (state: TokenState, action: TokenAction) => {
    switch (action.type) {
        case 'setContract':
            return {
                ...state,
                contract: action.contract,
            };
        case 'setNames':
            return {
                ...state,
                longTokenName: action.longToken,
                shortTokenName: action.shortToken,
            }
        default:
            throw new Error('Unexpected action');
    }
};

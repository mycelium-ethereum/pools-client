import Tracer from '@libs/Tracer';
import { BigNumber } from 'bignumber.js';

/**
 * All insurance pool info
 */
export type InsurancePoolInfo = {
    tracer: Tracer;
    market: string;
    liquidity: BigNumber;
    target: BigNumber;
    userBalance: BigNumber;
    rewards: BigNumber;
    health: BigNumber;
    apy: BigNumber;
    buffer: BigNumber;
    iPoolTokenURL: string;
    iPoolTokenName: string;
};

import { Pool } from '@libs/types/General';
import { BigNumber } from 'bignumber.js';
import { SideEnum } from '.';

export const DEFAULT_POOLSTATE: Pool = {
    address: '',
    name: '',
    lastPrice: new BigNumber(0),
    updateInterval: new BigNumber(0),
    lastUpdate: new BigNumber(0),
    shortBalance: new BigNumber(0),
    longBalance: new BigNumber(0),
    nextShortBalance: new BigNumber(0),
    nextLongBalance: new BigNumber(0),
    leverage: 0,
    keeper: '',
    oraclePrice: new BigNumber(0),
    frontRunningInterval: new BigNumber(0),
    quoteToken: {
        address: '',
        name: '',
        symbol: '',
        decimals: 18,
        balance: new BigNumber(0),
        approvedAmount: new BigNumber(0),
    },
    shortToken: {
        address: '',
        name: '',
        symbol: '',
        decimals: 18,
        balance: new BigNumber(0),
        supply: new BigNumber(0),
        approvedAmount: new BigNumber(0),
        side: SideEnum.short,
    },
    longToken: {
        address: '',
        name: '',
        symbol: '',
        decimals: 18,
        balance: new BigNumber(0),
        supply: new BigNumber(0),
        approvedAmount: new BigNumber(0),
        side: SideEnum.long,
    },
    committer: {
        address: '',
        global: {
            pendingLong: {
                mint: new BigNumber(0),
                burn: new BigNumber(0),
            },
            pendingShort: {
                mint: new BigNumber(0),
                burn: new BigNumber(0),
            },
        },
        user: {
            claimable: {
                shortTokens: new BigNumber(0),
                longTokens: new BigNumber(0),
                settlementTokens: new BigNumber(0),
            }, 
            pending: {
                long: {
                    mint: new BigNumber(0),
                    burn: new BigNumber(0),
                },
                short: {
                    mint: new BigNumber(0),
                    burn: new BigNumber(0),
                },
            },
            followingUpdate: {
                long: {
                    mint: new BigNumber(0),
                    burn: new BigNumber(0),
                },
                short: {
                    mint: new BigNumber(0),
                    burn: new BigNumber(0),
                },
            }
        }
    },
    subscribed: false,
};

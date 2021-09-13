import { CreatedCommitType, Pool } from '@libs/types/General';
import { BigNumber } from 'bignumber.js';
import { SideEnum } from '.';

export const DEFAULT_POOLSTATE: Pool = {
    address: '',
    name: '',
    lastPrice: new BigNumber(0),
    updateInterval: new BigNumber(0),
    lastUpdate: new BigNumber(0),
    shortBalance: new BigNumber(0),
    leverage: 0,
    keeper: '',
    longBalance: new BigNumber(0),
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
        pendingLong: new BigNumber(0),
        pendingShort: new BigNumber(0),
        allUnexecutedCommits: [] as CreatedCommitType[],
        minimumCommitSize: new BigNumber(1000),
    },
    subscribed: false,
};

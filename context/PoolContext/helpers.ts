import { SideEnum, ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import { APICommitReturn, fetchPoolCommits, SourceType } from '@libs/utils/reputationAPI';
import { AggregateBalances, PendingAmounts, Pool, StaticPoolInfo } from '@libs/types/General';
import {
    LeveragedPool__factory,
    TestToken__factory,
    PoolCommitter__factory,
    ERC20__factory,
    PoolKeeper__factory,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import BigNumber from 'bignumber.js';
import { ethers, BigNumber as EthersBigNumber } from 'ethers';
import { DEFAULT_POOLSTATE } from '@libs/constants/pool';

/**
 *
 * @param pool address and name of the pool
 * @param provider ethers provider
 * @returns a Pool object
 */
export const initPool: (
    pool: StaticPoolInfo,
    provider: ethers.providers.JsonRpcProvider | ethers.providers.WebSocketProvider,
) => Promise<Pool> = async (pool, provider) => {
    const quoteTokenDecimals = pool.quoteToken.decimals;

    const { lastUpdate, shortBalance, longBalance, oraclePrice, lastPrice } = await fetchPoolBalances(
        {
            address: pool.address,
            keeper: pool.keeper,
            quoteTokenDecimals,
        },
        provider,
    );

    console.debug(`LastUpdate: ${lastUpdate.toNumber()}`);

    // fetch short and long tokeninfo
    const shortTokenInstance = TestToken__factory.connect(pool.shortToken.address, provider);
    // const longTokenInstance = new ethers.Contract(
    // pool.longToken.address,
    // TestToken__factory.abi,
    // provider,
    // ) as PoolToken;

    const longTokenInstance = TestToken__factory.connect(pool.longToken.address, provider);

    const [longTokenSupply, shortTokenSupply] = await Promise.all([
        longTokenInstance.totalSupply({
            blockTag: 'latest',
        }),
        shortTokenInstance.totalSupply({
            blockTag: 'latest',
        }),
    ]).catch((err) => {
        console.error('Failed to fetch short and long supply', err);
        return [ethers.BigNumber.from(0), ethers.BigNumber.from(0)];
    });

    // temp fix since the fetched leverage is in IEEE 128 bit. Get leverage amount from name
    const leverage = parseInt(pool.name.split('-')?.[0] ?? 1);
    return {
        ...pool,
        lastUpdate: lastUpdate,
        lastPrice: lastPrice,
        shortBalance: shortBalance,
        longBalance: longBalance,
        nextShortBalance: shortBalance,
        nextLongBalance: longBalance,
        oraclePrice: oraclePrice,
        committer: {
            address: pool.committer.address,
            pendingLong: {
                mint: new BigNumber(0),
                burn: new BigNumber(0),
            },
            pendingShort: {
                mint: new BigNumber(0),
                burn: new BigNumber(0),
            },
            allUnexecutedCommits: [],
        },
        // leverage: new BigNumber(leverageAmount.toString()), //TODO add this back when they change the units
        leverage: leverage,
        longToken: {
            ...pool.longToken,
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
            supply: new BigNumber(ethers.utils.formatUnits(longTokenSupply, quoteTokenDecimals)),
            side: SideEnum.long,
        },
        shortToken: {
            ...pool.shortToken,
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
            supply: new BigNumber(ethers.utils.formatUnits(shortTokenSupply, quoteTokenDecimals)),
            side: SideEnum.short,
        },
        quoteToken: {
            ...pool.quoteToken,
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        aggregateBalances: DEFAULT_POOLSTATE.aggregateBalances,
        subscribed: false,
    };
};

export const fetchPoolBalances: (
    poolInfo: {
        keeper: string;
        address: string;
        quoteTokenDecimals: number;
    },
    provider: ethers.providers.JsonRpcProvider | ethers.providers.WebSocketProvider,
) => Promise<{
    lastUpdate: BigNumber;
    lastPrice: BigNumber;
    shortBalance: BigNumber;
    longBalance: BigNumber;
    oraclePrice: BigNumber;
}> = async (poolInfo, provider) => {
    const contract = LeveragedPool__factory.connect(poolInfo.address, provider);

    // fetch last keeper price
    const keeperInstance = PoolKeeper__factory.connect(poolInfo.keeper, provider);

    const [lastUpdate, shortBalance, longBalance, oraclePrice, lastPrice] = await Promise.all([
        contract.lastPriceTimestamp({
            blockTag: 'latest',
        }),
        contract.shortBalance({
            blockTag: 'latest',
        }),
        contract.longBalance({
            blockTag: 'latest',
        }),
        contract.getOraclePrice({
            blockTag: 'latest',
        }),
        keeperInstance.executionPrice(poolInfo.address, {
            blockTag: 'latest',
        }),
    ]);

    return {
        lastUpdate: new BigNumber(lastUpdate.toString()),
        lastPrice: new BigNumber(ethers.utils.formatEther(lastPrice)),
        shortBalance: new BigNumber(ethers.utils.formatUnits(shortBalance, poolInfo.quoteTokenDecimals)),
        longBalance: new BigNumber(ethers.utils.formatUnits(longBalance, poolInfo.quoteTokenDecimals)),
        oraclePrice: new BigNumber(ethers.utils.formatEther(oraclePrice)),
    };
};

export const fetchCommits: (
    poolInfo: {
        address: string;
        committer: string;
        lastUpdate: number;
        quoteTokenDecimals: number;
    },
    provider: ethers.providers.JsonRpcProvider,
) => Promise<{
    pendingLong: PendingAmounts;
    pendingShort: PendingAmounts;
    allUnexecutedCommits: APICommitReturn[];
}> = async ({ committer, address: pool, lastUpdate, quoteTokenDecimals }, provider) => {
    console.debug(`Initialising committer: ${committer}`);
    const defaultState = {
        pendingLong: {
            mint: new BigNumber(0),
            burn: new BigNumber(0),
        },
        pendingShort: {
            mint: new BigNumber(0),
            burn: new BigNumber(0),
        },
        allUnexecutedCommits: [],
    };

    if (!provider || !committer) {
        return defaultState;
    }

    const contract = PoolCommitter__factory.connect(committer, provider);

    let allUnexecutedCommits: APICommitReturn[] = [];
    const network = provider.network.chainId;
    if (network === parseInt(ARBITRUM_RINKEBY) || network === parseInt(ARBITRUM)) {
        allUnexecutedCommits = await fetchPoolCommits(network.toString() as SourceType, {
            from: lastUpdate,
            pool,
        });
    }

    const updateInterval = await contract.updateIntervalId();
    const pendingAmounts = await contract.totalPoolCommitments(updateInterval);

    console.log('pending mint amounts', pendingAmounts);

    console.debug('All commits unfiltered', allUnexecutedCommits);

    const pendingShort: PendingAmounts = {
        mint: new BigNumber(ethers.utils.formatUnits(pendingAmounts[0], quoteTokenDecimals)),
        burn: new BigNumber(ethers.utils.formatUnits(pendingAmounts[1], quoteTokenDecimals)),
    };

    const pendingLong: PendingAmounts = {
        mint: new BigNumber(ethers.utils.formatUnits(pendingAmounts[2], quoteTokenDecimals)),
        burn: new BigNumber(ethers.utils.formatUnits(pendingAmounts[3], quoteTokenDecimals)),
    };

    console.debug(`Pending Long`, pendingLong);
    console.debug(`Pending Short`, pendingShort);

    return {
        pendingLong,
        pendingShort,
        allUnexecutedCommits,
    };
};

export const fetchTokenBalances: (
    tokens: string[],
    provider: ethers.providers.JsonRpcProvider,
    account: string,
    pool: string,
) => Promise<EthersBigNumber[]> = (tokens, provider, account) => {
    return Promise.all(
        tokens.map((token) => {
            const tokenContract = ERC20__factory.connect(token, provider);
            return tokenContract.balanceOf(account, {
                blockTag: 'latest',
            });
        }),
    );
};

export const fetchAggregateBalance: (
    provider: ethers.providers.JsonRpcProvider,
    account: string,
    committer: string,
    quoteTokenDecimals: number,
) => Promise<AggregateBalances> = async (provider, account, committer, quoteTokenDecimals) => {
    const contract = PoolCommitter__factory.connect(committer, provider);
    const balances = await contract.getAggregateBalance(account);
    // const balances = await contract.getAggregateBalance('0x110af92Ba116fD7868216AA794a7E4dA3b9D7D11');
    return {
        longTokens: new BigNumber(ethers.utils.formatUnits(balances.longTokens), quoteTokenDecimals),
        shortTokens: new BigNumber(ethers.utils.formatUnits(balances.shortTokens), quoteTokenDecimals),
        quoteTokens: new BigNumber(ethers.utils.formatUnits(balances.settlementTokens), quoteTokenDecimals),
    };
};

export const fetchTokenApprovals: (
    tokens: string[],
    provider: ethers.providers.JsonRpcProvider,
    account: string,
    pool: string,
) => Promise<EthersBigNumber[]> = (tokens, provider, account, pool) => {
    return Promise.all(
        tokens.map((token) => {
            const tokenContract = ERC20__factory.connect(token, provider);
            return tokenContract.allowance(account, pool, {
                blockTag: 'latest',
            });
        }),
    );
};

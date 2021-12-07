import { SideEnum, CommitEnum, ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import { APICommitReturn, fetchPoolCommits, SourceType } from '@libs/utils/reputationAPI';
import { PendingAmounts, Pool, StaticPoolInfo } from '@libs/types/General';
import {
    LeveragedPool__factory,
    TestToken__factory,
    PoolCommitter__factory,
    ERC20__factory,
    ERC20,
    PoolCommitter,
    LeveragedPool,
    PoolToken,
    PoolKeeper__factory,
    PoolKeeper,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import BigNumber from 'bignumber.js';
import { ethers, BigNumber as EthersBigNumber } from 'ethers';

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
    const contract = new ethers.Contract(pool.address, LeveragedPool__factory.abi, provider) as LeveragedPool;

    const [lastUpdate, shortBalance, longBalance, oraclePrice] = await Promise.all([
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
    ]);

    console.debug(`LastUpdate: ${lastUpdate.toNumber()}`);

    // fetch short and long tokeninfo
    const shortTokenInstance = new ethers.Contract(
        pool.shortToken.address,
        TestToken__factory.abi,
        provider,
    ) as PoolToken;
    const longTokenInstance = new ethers.Contract(
        pool.longToken.address,
        TestToken__factory.abi,
        provider,
    ) as PoolToken;
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

    // fetch minimum commit size
    const poolCommitterInstance = new ethers.Contract(
        pool.committer.address,
        PoolCommitter__factory.abi,
        provider,
    ) as PoolCommitter;
    const minimumCommitSize = await poolCommitterInstance.minimumCommitSize({
        blockTag: 'latest',
    });

    // fetch last keeper price
    const keeperInstance = new ethers.Contract(pool.keeper, PoolKeeper__factory.abi, provider) as PoolKeeper;

    const lastPrice = await keeperInstance.executionPrice(pool.address, {
        blockTag: 'latest',
    });

    const quoteTokenDecimals = pool.quoteToken.decimals;

    // temp fix since the fetched leverage is in IEEE 128 bit. Get leverage amount from name
    const leverage = parseInt(pool.name.split('-')?.[0] ?? 1);
    return {
        ...pool,
        lastUpdate: new BigNumber(lastUpdate.toString()),
        lastPrice: new BigNumber(ethers.utils.formatEther(lastPrice)),
        shortBalance: new BigNumber(ethers.utils.formatUnits(shortBalance, quoteTokenDecimals)),
        longBalance: new BigNumber(ethers.utils.formatUnits(longBalance, quoteTokenDecimals)),
        nextShortBalance: new BigNumber(ethers.utils.formatUnits(shortBalance, quoteTokenDecimals)),
        nextLongBalance: new BigNumber(ethers.utils.formatUnits(longBalance, quoteTokenDecimals)),
        oraclePrice: new BigNumber(ethers.utils.formatEther(oraclePrice)),
        committer: {
            address: pool.committer.address,
            minimumCommitSize: new BigNumber(minimumCommitSize.toString()),
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
        subscribed: false,
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

    const contract = new ethers.Contract(committer, PoolCommitter__factory.abi, provider) as PoolCommitter;

    let allUnexecutedCommits: APICommitReturn[] = [];
    const network = provider.network.chainId;
    if (network === parseInt(ARBITRUM_RINKEBY) || network === parseInt(ARBITRUM)) {
        allUnexecutedCommits = await fetchPoolCommits(network.toString() as SourceType, {
            from: lastUpdate,
            pool,
        });
    }

    const pendingAmounts = await Promise.all([
        contract.shadowPools(CommitEnum.short_mint),
        contract.shadowPools(CommitEnum.short_burn),
        contract.shadowPools(CommitEnum.long_mint),
        contract.shadowPools(CommitEnum.long_burn),
    ]);

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
            const tokenContract = new ethers.Contract(token, ERC20__factory.abi, provider) as ERC20;
            return tokenContract.balanceOf(account, {
                blockTag: 'latest',
            });
        }),
    );
};

export const fetchTokenApprovals: (
    tokens: string[],
    provider: ethers.providers.JsonRpcProvider,
    account: string,
    pool: string,
) => Promise<EthersBigNumber[]> = (tokens, provider, account, pool) => {
    return Promise.all(
        tokens.map((token) => {
            const tokenContract = new ethers.Contract(token, ERC20__factory.abi, provider) as ERC20;
            return tokenContract.allowance(account, pool, {
                blockTag: 'latest',
            });
        }),
    );
};

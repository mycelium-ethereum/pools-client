import { SideEnum, CommitEnum } from '@libs/constants';
import { CreatedCommitType, Pool, PoolType } from '@libs/types/General';
import {
    LeveragedPool__factory,
    TestToken__factory,
    PoolCommitter__factory,
    ERC20__factory,
    ERC20,
    PoolCommitter,
    LeveragedPool,
    PoolToken,
    TestToken,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import BigNumber from 'bignumber.js';
import { ethers, BigNumber as EthersBigNumber } from 'ethers';

/**
 *
 * @param pool address and name of the pool
 * @param provider ethers provider
 * @returns a Pool object
 */
export const initPool: (pool: PoolType, provider: ethers.providers.JsonRpcProvider) => Promise<Pool> = async (
    pool,
    provider,
) => {
    const contract = new ethers.Contract(pool.address, LeveragedPool__factory.abi, provider) as LeveragedPool;

    const [
        updateInterval,
        lastUpdate,
        shortBalance,
        longBalance,
        oraclePrice,
        quoteToken,
        longToken,
        shortToken,
        poolCommitter,
        leverageAmount,
    ] = await Promise.all([
        contract.updateInterval(),
        contract.lastPriceTimestamp(),
        contract.shortBalance(),
        contract.longBalance(),
        contract.getOraclePrice(),
        contract.quoteToken(),
        contract.tokens(0),
        contract.tokens(1),
        contract.poolCommitter(),
        contract.leverageAmount(),
    ]);

    const [frontRunningInterval, keeper] = await Promise.all([contract.frontRunningInterval(), contract.keeper()]);

    console.debug(
        `Update interval: ${updateInterval}, lastUpdate: ${lastUpdate.toNumber()}, frontRunningInterval: ${frontRunningInterval}`,
    );

    // fetch short and long tokeninfo
    const shortTokenInstance = new ethers.Contract(shortToken, TestToken__factory.abi, provider) as PoolToken;
    const [shortTokenName, shortTokenSymbol, shortTokenSupply, shortTokenDecimals] = await Promise.all([
        shortTokenInstance.name(),
        shortTokenInstance.symbol(),
        shortTokenInstance.totalSupply(),
        shortTokenInstance.decimals(),
    ]);

    const longTokenInstance = new ethers.Contract(longToken, TestToken__factory.abi, provider) as PoolToken;
    const [longTokenName, longTokenSymbol, longTokenSupply, longTokenDecimals] = await Promise.all([
        longTokenInstance.name(),
        longTokenInstance.symbol(),
        longTokenInstance.totalSupply(),
        longTokenInstance.decimals(),
    ]);

    // fetch quote token info
    const quoteTokenInstance = new ethers.Contract(quoteToken, TestToken__factory.abi, provider) as TestToken;
    const [quoteTokenName, quoteTokenSymbol, quoteTokenDecimals] = await Promise.all([
        quoteTokenInstance.name(),
        quoteTokenInstance.symbol(),
        quoteTokenInstance.decimals(),
    ]);

    // fetch minimum commit size
    const poolCommitterInstance = new ethers.Contract(
        poolCommitter,
        PoolCommitter__factory.abi,
        provider,
    ) as PoolCommitter;
    const minimumCommitSize = await poolCommitterInstance.minimumCommitSize();

    console.log('Leverage still whack', new BigNumber(leverageAmount).toNumber());
    // temp fix since the fetched leverage is in IEEE 128 bit. Get leverage amount from name
    const leverage = parseInt(pool.name.split('-')?.[0] ?? 1);
    return {
        ...pool,
        updateInterval: new BigNumber(updateInterval.toString()),
        lastUpdate: new BigNumber(lastUpdate.toString()),
        lastPrice: new BigNumber(0),
        shortBalance: new BigNumber(ethers.utils.formatEther(shortBalance)),
        longBalance: new BigNumber(ethers.utils.formatEther(longBalance)),
        oraclePrice: new BigNumber(ethers.utils.formatEther(oraclePrice)),
        frontRunningInterval: new BigNumber(frontRunningInterval.toString()),
        committer: {
            address: poolCommitter,
            pendingLong: new BigNumber(0),
            pendingShort: new BigNumber(0),
            allUnexecutedCommits: [],
            minimumCommitSize: new BigNumber(minimumCommitSize.toString()),
        },
        keeper,
        // leverage: new BigNumber(leverageAmount.toString()), //TODO add this back when they change the units
        leverage: leverage,
        longToken: {
            address: longToken,
            name: longTokenName,
            symbol: longTokenSymbol,
            decimals: longTokenDecimals,
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
            supply: new BigNumber(ethers.utils.formatEther(longTokenSupply)),
            side: SideEnum.long,
        },
        shortToken: {
            address: shortToken,
            name: shortTokenName,
            symbol: shortTokenSymbol,
            decimals: shortTokenDecimals,
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
            supply: new BigNumber(ethers.utils.formatEther(shortTokenSupply)),
            side: SideEnum.short,
        },
        quoteToken: {
            address: quoteToken,
            name: quoteTokenName,
            symbol: quoteTokenSymbol,
            decimals: quoteTokenDecimals,
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        subscribed: false,
    };
};

const MAX_SOL_UINT = ethers.BigNumber.from('340282366920938463463374607431768211455');

export const fetchCommits: (
    committer: string,
    provider: ethers.providers.JsonRpcProvider,
) => Promise<{
    pendingLong: BigNumber;
    pendingShort: BigNumber;
    allUnexecutedCommits: CreatedCommitType[];
}> = async (committer, provider) => {
    console.debug('Initialising committer');
    const contract = new ethers.Contract(committer, PoolCommitter__factory.abi, provider) as PoolCommitter;

    const earliestUnexecuted = await contract?.earliestCommitUnexecuted();
    if (earliestUnexecuted.eq(MAX_SOL_UINT)) {
        console.debug('No unexecuted commits');
        return {
            pendingLong: new BigNumber(0),
            pendingShort: new BigNumber(0),
            allUnexecutedCommits: [],
        };
    }

    // current blocknumber alchemy has a 2000 block limit
    const minBlockCheck = (await provider.getBlockNumber()) - 1990;

    console.debug(`Not checking past ${minBlockCheck}`);
    // once we have this we can get the block number and query all commits from that block number
    const earliestUnexecutedCommit = (
        await contract?.queryFilter(contract.filters.CreateCommit(earliestUnexecuted), minBlockCheck)
    )?.[0];

    console.debug(`Found earliestUnececutedCommit at id: ${earliestUnexecuted.toString()}`, earliestUnexecutedCommit);

    const allUnexecutedCommits = (await contract?.queryFilter(
        contract.filters.CreateCommit(),
        Math.max(earliestUnexecutedCommit?.blockNumber ?? 0, minBlockCheck),
    )) as CreatedCommitType[];

    console.debug('All commits unfiltered', allUnexecutedCommits);

    let pendingLong = new BigNumber(0);
    let pendingShort = new BigNumber(0);

    allUnexecutedCommits.forEach((commit) => {
        [pendingShort, pendingLong] = addToPending(pendingShort, pendingLong, {
            amount: commit.args.amount,
            type: commit.args.commitType,
        });
    });
    console.debug(`Pending commit amounts. Long: ${pendingLong.toNumber()}, short: ${pendingShort.toNumber()}`);

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
            return tokenContract.balanceOf(account);
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
            return tokenContract.allowance(account, pool);
        }),
    );
};

export const addToPending: (
    pendingShort: BigNumber,
    pendingLong: BigNumber,
    commit: {
        amount: EthersBigNumber;
        type: number;
    },
) => [BigNumber, BigNumber] = (pendingShort, pendingLong, commit) => {
    switch (commit.type) {
        case CommitEnum.short_mint:
            return [pendingShort.plus(new BigNumber(ethers.utils.formatEther(commit.amount))), pendingLong];
        case CommitEnum.short_burn:
            return [pendingShort.minus(new BigNumber(ethers.utils.formatEther(commit.amount))), pendingLong];
        case CommitEnum.long_mint:
            return [pendingShort, pendingLong.plus(new BigNumber(ethers.utils.formatEther(commit.amount)))];
        case CommitEnum.long_burn:
            return [pendingShort, pendingLong.minus(new BigNumber(ethers.utils.formatEther(commit.amount)))];
        default:
            return [pendingShort, pendingLong];
    }
};

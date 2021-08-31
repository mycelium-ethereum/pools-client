import { LONG, LONG_BURN, LONG_MINT, SHORT, SHORT_BURN, SHORT_MINT } from '@libs/constants';
import { Pool, PoolType } from '@libs/types/General';
import {
    LeveragedPool__factory,
    TestToken__factory,
    PoolCommitter__factory,
    ERC20__factory,
    ERC20,
    PoolCommitter,
    LeveragedPool,
    PoolToken,
    TestToken 
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

    const [frontRunningInterval] = await Promise.all([contract.frontRunningInterval()]);

    console.log(updateInterval, lastUpdate.toNumber(), frontRunningInterval, 'Values');
    // fetch short and long tokeninfo
    const shortTokenInstance = new ethers.Contract(shortToken, TestToken__factory.abi, provider) as PoolToken;
    const [shortTokenName, shortTokenSupply] = await Promise.all([
        shortTokenInstance.name(),
        shortTokenInstance.totalSupply(),
    ]);

    const longTokenInstance = new ethers.Contract(longToken, TestToken__factory.abi, provider) as PoolToken;
    const [longTokenName, longTokenSupply] = await Promise.all([
        longTokenInstance.name(),
        longTokenInstance.totalSupply(),
    ]);

    // fetch quote token info
    const quoteTokenInstance = new ethers.Contract(quoteToken, TestToken__factory.abi, provider) as TestToken;
    const quoteTokenName = await quoteTokenInstance.name();

    console.log('Leverage still whack', new BigNumber(leverageAmount).toNumber());
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
        },
        // leverage: new BigNumber(leverageAmount.toString()), //TODO add this back when they change the units
        leverage: new BigNumber(2),
        longToken: {
            address: longToken,
            name: longTokenName,
            approved: false,
            balance: new BigNumber(0),
            supply: new BigNumber(ethers.utils.formatEther(longTokenSupply)),
            side: LONG,
        },
        shortToken: {
            address: shortToken,
            name: shortTokenName,
            approved: false,
            balance: new BigNumber(0),
            supply: new BigNumber(ethers.utils.formatEther(shortTokenSupply)),
            side: SHORT,
        },
        quoteToken: {
            address: quoteToken,
            name: quoteTokenName,
            approved: false,
            balance: new BigNumber(0),
        },
        subscribed: false,
    };
};

export const initCommitter: (
    committer: string,
    provider: ethers.providers.JsonRpcProvider,
) => Promise<{
    pendingLong: BigNumber;
    pendingShort: BigNumber;
}> = async (committer, provider) => {
    const contract = new ethers.Contract(committer, PoolCommitter__factory.abi, provider) as PoolCommitter;

    const earliestUnexecuted = await contract?.earliestCommitUnexecuted();
    // once we have this we can get the block number and query all commits from that block number
    const earliestUnexecutedCommit = (
        await contract?.queryFilter(contract.filters.CreateCommit(earliestUnexecuted))
    )?.[0];

    const allUnexecutedCommits = await contract?.queryFilter(
        contract.filters.CreateCommit(),
        earliestUnexecutedCommit?.blockNumber,
    );
    console.debug('All unexecuted commits', allUnexecutedCommits);
    let pendingLong = new BigNumber(0);
    let pendingShort = new BigNumber(0);
    allUnexecutedCommits?.forEach((commit) => {
        [pendingShort, pendingLong] = addToPending(pendingShort, pendingLong, {
            amount: commit.args.amount,
            type: commit.args.commitType,
        });
    });
    console.debug(`Pending commit amounts. Long: ${pendingLong.toNumber()}, short: ${pendingShort.toNumber()}`);
    return {
        pendingLong,
        pendingShort,
    };
};

export const fetchTokenBalances: (
    tokens: string[],
    provider: ethers.providers.JsonRpcProvider,
    account: string,
    pool: string,
) => Promise<[EthersBigNumber, EthersBigNumber][]> = (tokens, provider, account, pool) => {
    return Promise.all(
        tokens.map((token) => {
            const tokenContract = new ethers.Contract(token, ERC20__factory.abi, provider) as ERC20;
            return Promise.all([tokenContract.balanceOf(account), tokenContract.allowance(account, pool)]);
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
        case SHORT_MINT:
            return [pendingShort.plus(new BigNumber(ethers.utils.formatEther(commit.amount))), pendingLong];
        case SHORT_BURN:
            return [pendingShort.minus(new BigNumber(ethers.utils.formatEther(commit.amount))), pendingLong];
        case LONG_MINT:
            return [pendingShort, pendingLong.plus(new BigNumber(ethers.utils.formatEther(commit.amount)))];
        case LONG_BURN:
            return [pendingShort, pendingLong.minus(new BigNumber(ethers.utils.formatEther(commit.amount)))];
        default:
            return [pendingShort, pendingLong];
    }
};

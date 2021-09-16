import { SideEnum, CommitEnum, MAX_SOL_UINT } from '@libs/constants';
import { CreatedCommitType, PendingAmounts, Pool, PoolType } from '@libs/types/General';
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

    console.log(
        'LONG TOKEN SUPPLY',
        new BigNumber(ethers.utils.formatUnits(longTokenSupply, quoteTokenDecimals)).toString(),
    );
    console.log(
        'SHORT TOKEN SUPPLY',
        new BigNumber(ethers.utils.formatUnits(shortTokenSupply, quoteTokenDecimals)).toString(),
    );

    // fetch minimum commit size
    const poolCommitterInstance = new ethers.Contract(
        poolCommitter,
        PoolCommitter__factory.abi,
        provider,
    ) as PoolCommitter;
    const minimumCommitSize = await poolCommitterInstance.minimumCommitSize();

    // fetch last keeper price
    const keeperInstance = new ethers.Contract(keeper, PoolKeeper__factory.abi, provider) as PoolKeeper;

    const lastPrice = await keeperInstance.executionPrice(pool.address);

    console.debug('Leverage still whack', new BigNumber(leverageAmount).toNumber());
    // temp fix since the fetched leverage is in IEEE 128 bit. Get leverage amount from name
    const leverage = parseInt(pool.name.split('-')?.[0] ?? 1);
    return {
        ...pool,
        updateInterval: new BigNumber(updateInterval.toString()),
        lastUpdate: new BigNumber(lastUpdate.toString()),
        lastPrice: new BigNumber(ethers.utils.formatEther(lastPrice)),
        shortBalance: new BigNumber(ethers.utils.formatUnits(shortBalance, quoteTokenDecimals)),
        longBalance: new BigNumber(ethers.utils.formatUnits(longBalance, quoteTokenDecimals)),
        nextShortBalance: new BigNumber(ethers.utils.formatUnits(shortBalance, quoteTokenDecimals)),
        nextLongBalance: new BigNumber(ethers.utils.formatUnits(longBalance, quoteTokenDecimals)),
        oraclePrice: new BigNumber(ethers.utils.formatEther(oraclePrice)),
        frontRunningInterval: new BigNumber(frontRunningInterval.toString()),
        committer: {
            address: poolCommitter,
            pendingLong: {
                mint: new BigNumber(0),
                burn: new BigNumber(0),
            },
            pendingShort: {
                mint: new BigNumber(0),
                burn: new BigNumber(0),
            },
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
            // supply: new BigNumber(ethers.utils.formatUnits(longTokenSupply, quoteTokenDecimals)),
            // supply: new BigNumber(ethers.utils.formatUnits(longTokenSupply, quoteTokenDecimals)),
            supply: new BigNumber(longTokenSupply.toString()),
            side: SideEnum.long,
        },
        shortToken: {
            address: shortToken,
            name: shortTokenName,
            symbol: shortTokenSymbol,
            decimals: shortTokenDecimals,
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
            // supply: new BigNumber(ethers.utils.formatUnits(shortTokenSupply, quoteTokenDecimals)),
            supply: new BigNumber(shortTokenSupply.toString()),
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

export const fetchCommits: (
    committer: string,
    provider: ethers.providers.JsonRpcProvider,
    quoteTokenDecimals: number,
) => Promise<{
    pendingLong: PendingAmounts;
    pendingShort: PendingAmounts;
    allUnexecutedCommits: CreatedCommitType[];
}> = async (committer, provider, quoteTokenDecimals) => {
    console.debug('Initialising committer');
    const contract = new ethers.Contract(committer, PoolCommitter__factory.abi, provider) as PoolCommitter;

    const earliestUnexecuted = await contract?.earliestCommitUnexecuted();
    if (earliestUnexecuted.eq(MAX_SOL_UINT)) {
        console.debug('No unexecuted commits');
        return {
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

    const pendingLong: PendingAmounts = {
        mint: new BigNumber(0),
        burn: new BigNumber(0),
    };

    const pendingShort: PendingAmounts = {
        mint: new BigNumber(0),
        burn: new BigNumber(0),
    };

    allUnexecutedCommits.forEach((commit) => {
        const amount = new BigNumber(ethers.utils.formatUnits(commit.args.amount, quoteTokenDecimals));
        switch (commit.args.commitType) {
            case CommitEnum.short_mint:
                pendingShort.mint = pendingShort.mint.plus(amount);
                break;
            case CommitEnum.short_burn:
                pendingShort.burn = pendingShort.burn.plus(amount);
                break;
            case CommitEnum.long_mint:
                pendingLong.mint = pendingLong.mint.plus(amount);
                break;
            case CommitEnum.long_burn:
                pendingLong.burn = pendingLong.burn.plus(amount);
                break;
            default:
            // do nothing
        }
    });

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

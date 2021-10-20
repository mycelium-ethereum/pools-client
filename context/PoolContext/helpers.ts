import { SideEnum, CommitEnum, ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import { APICommitReturn, fetchPoolCommits, SourceType } from '@libs/utils/reputationAPI';
import { PendingAmounts, Pool, PoolType } from '@libs/types/General';
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
export const initPool: (pool: PoolType, provider: ethers.providers.JsonRpcProvider | ethers.Signer) => Promise<Pool> =
    async (pool, provider) => {
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

        const [frontRunningInterval, keeper, name] = await Promise.all([
            contract.frontRunningInterval(),
            contract.keeper(),
            contract.poolName(),
        ]);

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

        // fetch last keeper price
        const keeperInstance = new ethers.Contract(keeper, PoolKeeper__factory.abi, provider) as PoolKeeper;

        const lastPrice = await keeperInstance.executionPrice(pool.address);

        console.debug('Leverage still whack', new BigNumber(leverageAmount).toNumber());
        // temp fix since the fetched leverage is in IEEE 128 bit. Get leverage amount from name
        const leverage = parseInt(name.split('-')?.[0] ?? 1);
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
                supply: new BigNumber(ethers.utils.formatUnits(longTokenSupply, quoteTokenDecimals)),
                side: SideEnum.long,
            },
            shortToken: {
                address: shortToken,
                name: shortTokenName,
                symbol: shortTokenSymbol,
                decimals: shortTokenDecimals,
                approvedAmount: new BigNumber(0),
                balance: new BigNumber(0),
                supply: new BigNumber(ethers.utils.formatUnits(shortTokenSupply, quoteTokenDecimals)),
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
        allUnexecutedCommits = await fetchPoolCommits(pool, network.toString() as SourceType, {
            from: lastUpdate,
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

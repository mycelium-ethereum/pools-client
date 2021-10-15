import { SideEnum } from '@libs/constants';
import { Committer, PendingAmounts, Pool, PoolType } from '@libs/types/General';
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

        // fetch last keeper price
        const keeperInstance = new ethers.Contract(keeper, PoolKeeper__factory.abi, provider) as PoolKeeper;

        const lastPrice = await keeperInstance.executionPrice(pool.address);

        console.debug('Leverage still whack', new BigNumber(leverageAmount).toNumber());
        // temp fix since the fetched leverage is in IEEE 128 bit. Get leverage amount from name
        const leverage = parseInt(name.split('-')?.[0] ?? 1);
        return {
            ...pool,
            name: await contract.poolName(),
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
                user : {
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
        committer: string,
        quoteTokenDecimals: number
    },
    provider: ethers.providers.JsonRpcProvider,
) => Promise<{
    pendingLong: PendingAmounts;
    pendingShort: PendingAmounts;
}> = async ({
    committer, quoteTokenDecimals
}, provider) => {
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

    const totalMostRecentCommit = await contract.totalMostRecentCommit();
    const totalNextIntervalCommit = await contract.totalNextIntervalCommit();

    console.log("Total most recent", totalMostRecentCommit)
    console.log("Totale next interval", totalNextIntervalCommit)

    return {
        pendingLong: {
            mint: new BigNumber(ethers.utils.formatUnits(totalMostRecentCommit.longMintAmount, quoteTokenDecimals)),
            burn: new BigNumber(ethers.utils.formatUnits(totalMostRecentCommit.longBurnAmount, quoteTokenDecimals)),
        }, 
        pendingShort: {
            mint: new BigNumber(ethers.utils.formatUnits(totalMostRecentCommit.shortMintAmount, quoteTokenDecimals)),
            burn: new BigNumber(ethers.utils.formatUnits(totalMostRecentCommit.shortBurnAmount, quoteTokenDecimals)),
        }
    };
};

export const fetchUserCommits: (
    committer: string,
    account: string,
    quoteTokenDecimals: number,
    provider: ethers.providers.JsonRpcProvider,
) => Promise<Committer['user']> = async (committer, account, quoteTokenDecimals, provider) => {
    const defaultState = {
        claimable: {
            longTokens: new BigNumber(0),
            shortTokens: new BigNumber(0),
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
    };

    if (!provider || !committer) {
        return defaultState;
    }

    const contract = new ethers.Contract(committer, PoolCommitter__factory.abi, provider) as PoolCommitter;
    const {
        longTokens,
        shortTokens,
        settlementTokens
    } = await contract.getAggregateBalance(account);


    const updateInterval = await contract.updateIntervalId();

    let pending = {
        long: {
            mint: new BigNumber(0),
            burn: new BigNumber(0)
        },
        short: {
            mint: new BigNumber(0),
            burn: new BigNumber(0)
        }
    };
    let followingUpdate = {
        long: {
            mint: new BigNumber(0),
            burn: new BigNumber(0)
        },
        short: {
            mint: new BigNumber(0),
            burn: new BigNumber(0)
        }
    };
    const userMostRecentCommit = await contract.userMostRecentCommit(account)
    const userNextIntervalCommit = await contract.userNextIntervalCommit(account)
    if (userMostRecentCommit.updateIntervalId.gte(updateInterval)) {
        // this means the userMostRecent is the current updateInterval therefore pending
        pending = {
            long: {
                mint: new BigNumber(ethers.utils.formatUnits(userMostRecentCommit.longMintAmount, quoteTokenDecimals)),
                burn: new BigNumber(ethers.utils.formatUnits(userMostRecentCommit.longBurnAmount, quoteTokenDecimals)),
            },
            short: {
                mint: new BigNumber(ethers.utils.formatUnits(userMostRecentCommit.shortMintAmount, quoteTokenDecimals)),
                burn: new BigNumber(ethers.utils.formatUnits(userMostRecentCommit.shortBurnAmount, quoteTokenDecimals)),
            }
        }
    } else if (userNextIntervalCommit.updateIntervalId.eq(updateInterval)) {
        // this means a user committed during front running interval and is in the next update interval
        pending = {
            long: {
                mint: new BigNumber(ethers.utils.formatUnits(userNextIntervalCommit.longMintAmount, quoteTokenDecimals)),
                burn: new BigNumber(ethers.utils.formatUnits(userNextIntervalCommit.longBurnAmount, quoteTokenDecimals)),
            },
            short: {
                mint: new BigNumber(ethers.utils.formatUnits(userNextIntervalCommit.shortMintAmount, quoteTokenDecimals)),
                burn: new BigNumber(ethers.utils.formatUnits(userNextIntervalCommit.shortBurnAmount, quoteTokenDecimals)),
            }
        }
    } else if (userNextIntervalCommit.updateIntervalId.gt(updateInterval)) {
        // user submitted in front running interval it will be included in the next round
        followingUpdate = {
            long: {
                mint: new BigNumber(ethers.utils.formatUnits(userNextIntervalCommit.longMintAmount, quoteTokenDecimals)),
                burn: new BigNumber(ethers.utils.formatUnits(userNextIntervalCommit.longBurnAmount, quoteTokenDecimals)),
            },
            short: {
                mint: new BigNumber(ethers.utils.formatUnits(userNextIntervalCommit.shortMintAmount, quoteTokenDecimals)),
                burn: new BigNumber(ethers.utils.formatUnits(userNextIntervalCommit.shortBurnAmount, quoteTokenDecimals)),
            }
        }

    }

    return {
        claimable: {
            longTokens: new BigNumber(ethers.utils.formatUnits(longTokens, quoteTokenDecimals)),
            shortTokens: new BigNumber(ethers.utils.formatUnits(shortTokens, quoteTokenDecimals)),
            settlementTokens: new BigNumber(ethers.utils.formatUnits(settlementTokens, quoteTokenDecimals)),
        },
        pending,
        followingUpdate
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

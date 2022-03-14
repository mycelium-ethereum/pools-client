import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import { APICommitReturn, fetchPoolCommits, SourceType } from '@libs/utils/reputationAPI';
import { AggregateBalances } from '@libs/types/General';
import {
    LeveragedPool__factory,
    PoolCommitter__factory,
    ERC20__factory,
    PoolKeeper__factory,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import BigNumber from 'bignumber.js';
import { ethers, BigNumber as EthersBigNumber } from 'ethers';

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
    },
    provider: ethers.providers.JsonRpcProvider,
) => Promise<{
    allUnexecutedCommits: APICommitReturn[];
}> = async ({ committer, address: pool, lastUpdate }, provider) => {
    console.debug(`Initialising committer: ${committer}`);

    if (!provider || !committer) {
        return {
            allUnexecutedCommits: [],
        };
    }

    let allUnexecutedCommits: APICommitReturn[] = [];
    const network = provider.network.chainId;
    if (network === parseInt(ARBITRUM_RINKEBY) || network === parseInt(ARBITRUM)) {
        allUnexecutedCommits = await fetchPoolCommits(network.toString() as SourceType, {
            from: lastUpdate,
            pool,
        });
    }

    // const contract = PoolCommitter__factory.connect(committer, provider);
    // const updateInterval = await contract.updateIntervalId();
    // const pendingAmounts = await contract.totalPoolCommitments(updateInterval);
    // console.info('Pending mint amounts', pendingAmounts);
    //
    console.debug('All commits unfiltered', allUnexecutedCommits);

    return {
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
        longTokens: new BigNumber(ethers.utils.formatUnits(balances.longTokens, quoteTokenDecimals)),
        shortTokens: new BigNumber(ethers.utils.formatUnits(balances.shortTokens, quoteTokenDecimals)),
        quoteTokens: new BigNumber(ethers.utils.formatUnits(balances.settlementTokens, quoteTokenDecimals)),
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

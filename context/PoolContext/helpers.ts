import BigNumber from 'bignumber.js';
import { ethers, BigNumber as EthersBigNumber } from 'ethers';
import { BalanceTypeEnum } from '@tracer-protocol/pools-js';
import {
    LeveragedPool__factory,
    PoolCommitter__factory,
    ERC20__factory,
    PoolKeeper__factory,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import { ARBITRUM, ARBITRUM_RINKEBY } from '@constants/networks';
import { PendingCommits, V2_SUPPORTED_NETWORKS, fetchPendingCommits } from '@libs/utils/tracerAPI';
import { AggregateBalances } from '@libs/types/General';

export const fetchPoolBalances: (
    poolInfo: {
        keeper: string;
        address: string;
        settlementTokenDecimals: number;
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
        shortBalance: new BigNumber(ethers.utils.formatUnits(shortBalance, poolInfo.settlementTokenDecimals)),
        longBalance: new BigNumber(ethers.utils.formatUnits(longBalance, poolInfo.settlementTokenDecimals)),
        oraclePrice: new BigNumber(ethers.utils.formatEther(oraclePrice)),
    };
};

export const fetchUnexcutedCommits: (
    poolInfo: {
        address: string;
        committer: string;
    },
    provider: ethers.providers.JsonRpcProvider,
) => Promise<{
    allUnexecutedCommits: PendingCommits[];
}> = async ({ committer, address: pool }, provider) => {
    console.debug(`Initialising committer: ${committer}`);

    if (!provider || !committer) {
        return {
            allUnexecutedCommits: [],
        };
    }

    let allUnexecutedCommits: PendingCommits[] = [];
    const network = provider.network.chainId;
    if (network === parseInt(ARBITRUM_RINKEBY) || network === parseInt(ARBITRUM)) {
        allUnexecutedCommits = await fetchPendingCommits(network.toString() as V2_SUPPORTED_NETWORKS, {
            pool,
        });
    }

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
    settlementTokenDecimals: number,
) => Promise<AggregateBalances> = async (provider, account, committer, settlementTokenDecimals) => {
    const contract = PoolCommitter__factory.connect(committer, provider);
    const balances = await contract.getAggregateBalance(account);

    // const balances = await contract.getAggregateBalance('0x110af92Ba116fD7868216AA794a7E4dA3b9D7D11');
    return {
        longTokens: new BigNumber(ethers.utils.formatUnits(balances.longTokens, settlementTokenDecimals)),
        shortTokens: new BigNumber(ethers.utils.formatUnits(balances.shortTokens, settlementTokenDecimals)),
        settlementTokens: new BigNumber(ethers.utils.formatUnits(balances.settlementTokens, settlementTokenDecimals)),
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

export const fromAggregateBalances: (balanceType: BalanceTypeEnum) => boolean = (balanceType) =>
    balanceType === BalanceTypeEnum.escrow;

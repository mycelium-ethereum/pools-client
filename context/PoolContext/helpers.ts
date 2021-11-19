import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import { APICommitReturn, fetchPoolCommits, SourceType } from '@libs/utils/reputationAPI';
import { PoolToken, Token } from '@tracer-protocol/pools-js';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

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
        allUnexecutedCommits = await fetchPoolCommits(pool, network.toString() as SourceType, {
            from: lastUpdate,
        });
    }

    console.debug('All commits unfiltered', allUnexecutedCommits);

    return {
        allUnexecutedCommits,
    };
};

export const fetchTokenBalances: (tokens: (PoolToken | Token)[], account: string) => Promise<BigNumber[]> = (
    tokens,
    account,
) => {
    return Promise.all(
        tokens.map((token) => {
            return token.fetchBalance(account);
        }),
    );
};

export const fetchTokenApprovals: (
    tokens: (PoolToken | Token)[],
    account: string,
    pool: string,
) => Promise<BigNumber[]> = (tokens, account, pool) => {
    return Promise.all(
        tokens.map((token) => {
            return token.fetchAllowance(account, pool);
        }),
    );
};

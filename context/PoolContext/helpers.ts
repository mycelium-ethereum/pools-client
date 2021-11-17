import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import { APICommitReturn, fetchPoolCommits, SourceType } from '@libs/utils/reputationAPI';
import {
    ERC20__factory,
    ERC20,
} from '@tracer-protocol/perpetual-pools-contracts/types';
import { ethers, BigNumber as EthersBigNumber } from 'ethers';

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
            allUnexecutedCommits: []
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

import { ARBITRUM, ARBITRUM_RINKEBY, CommitTypeMap } from '@libs/constants';
import { CommitEnum } from '@tracer-protocol/pools-js';

export type SourceType = typeof ARBITRUM_RINKEBY | typeof ARBITRUM;

const BASE_REPUTATION_API = process.env.NEXT_PUBLIC_BASE_REPUTATION_API;

const SourceMap: Record<SourceType, string> = {
    [ARBITRUM]: 'Arbitrum',
    [ARBITRUM_RINKEBY]: 'Arbitrum-Rinkeby',
};

export type Commit = {
    amount: string;
    block_number: string;
    block_timestamp: string; // in seconds
    commit_type: 'LongBurn' | 'LongMint' | 'ShortMint' | 'ShortBurn';
    committer_address: string;
    pool_address: string;
    source: 'Arbitrum' | 'Arbitrum-Rinkeby';
    transaction_hash: string;
    // gas_fee_cap: string
    // gas_price: string
    // gas_tip_cap: string
    // gas_used: string
};

export type APICommitReturn = {
    amount: string; // unparsed amount
    commitType: CommitEnum;
    txnHash: string;
    timestamp: number; // seconds
    from: string;
    commitID: number;
    pool: string; // pool address
};

export const fetchPoolCommits: (
    network: SourceType,
    params: {
        pool?: string;
        from?: number;
        to?: number;
        account?: string;
    },
) => Promise<APICommitReturn[]> = async (network, { pool, from, to, account }) => {
    const route = `${BASE_REPUTATION_API}/commits?source=${SourceMap[network]}&from=${from ?? 0}&to=${
        to ?? Math.round(Date.now() / 1000)
    }${!!pool ? `&pool_address=${pool?.toLowerCase()}` : ''}${!!account ? `&committer_address=${account}` : ''}`;
    const commits: APICommitReturn[] = await fetch(route)
        .then((res) => res.json())
        .then((commits) => {
            const parsedCommits: APICommitReturn[] = [];
            commits.forEach((commit: Commit, index: number) => {
                parsedCommits.push({
                    amount: commit.amount,
                    commitType: CommitTypeMap[commit.commit_type],
                    from: commit.committer_address,
                    txnHash: commit.transaction_hash,
                    timestamp: parseInt(commit.block_timestamp),
                    // hacky solution while I wait for rep guys to put commitID
                    commitID: index,
                    pool: commit.pool_address,
                });
            });
            return parsedCommits;
        })
        .catch((err) => {
            console.error('Failed to fetch commits', err);
            return [];
        });
    return commits;
};

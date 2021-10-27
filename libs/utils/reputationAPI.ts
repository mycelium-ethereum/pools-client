import { ARBITRUM, ARBITRUM_RINKEBY, CommitEnum } from '@libs/constants';

export type SourceType = typeof ARBITRUM_RINKEBY | typeof ARBITRUM;

const BASE_REPUTATION_API = 'https://api.dev.reputation.link/protocol/tracer';

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
};

const CommitTypeMap = {
    LongBurn: CommitEnum.long_burn,
    LongMint: CommitEnum.long_mint,
    ShortBurn: CommitEnum.short_burn,
    ShortMint: CommitEnum.short_mint,
};
export const fetchPoolCommits: (
    pool: string,
    network: SourceType,
    params: {
        from?: number;
        to?: number;
    },
) => Promise<APICommitReturn[]> = async (pool, network, { from, to }) => {
    const commits: APICommitReturn[] = await fetch(
        `${BASE_REPUTATION_API}/commits?source=${SourceMap[network]}&from=${from ?? 0}&to=${
            to ?? Math.round(Date.now() / 1000)
        }&pool_address=${pool.toLowerCase()}`,
    )
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

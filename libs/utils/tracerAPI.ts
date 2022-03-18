import { ARBITRUM, ARBITRUM_RINKEBY, CommitTypeMap } from '@libs/constants';
import { CommitEnum } from '@tracer-protocol/pools-js';

export type SourceType = typeof ARBITRUM_RINKEBY | typeof ARBITRUM;

const BASE_TRACER_API = process.env.NEXT_PUBLIC_TRACER_API;

export type TracerAPICommit = {
    date: number;
    pool: string;
    userAddress: string;
    type: 'LongBurn' | 'LongMint' | 'ShortMint' | 'ShortBurn' | 'LongBurnShortMint' | 'ShortBurnLongMint';
    transactionHashIn: string;
    tokenInAmount: string;
    // transactionHashOut: string,
    // tokenDecimals: 18,
    // tokenInAddress: string,
    // tokenInSymbol: string,
    // tokenInName: string,
    // price: string,
    // fee: string,
    // tokenOutAddress: string,
    // tokenOutSymbol: string,
    // tokenOutName: string,
    // tokenOutAmount: string
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
    const tracerRoute =
        `${BASE_TRACER_API}/poolsv2/tradeHistory` +
        `?network=${network}&from=${from ?? 0}&to=${to ?? Math.floor(Date.now() / 1000)}` +
        `${!!pool ? `&poolAddress=${pool}` : ''}` +
        `${!!account ? `&userAddress=${account}` : ''}`;
    const tracerCommits = await fetch(tracerRoute)
        .then((res) => res.json())
        .then((allCommits) => {
            console.log(allCommits);
            const parsedCommits: APICommitReturn[] = [];

            allCommits.rows.forEach((commit: TracerAPICommit, index: number) => {
                parsedCommits.push({
                    amount: commit.tokenInAmount,
                    commitType: CommitTypeMap[commit.type],
                    from: commit.userAddress,
                    txnHash: commit.transactionHashIn,
                    timestamp: parseInt(commit.date.toString()),
                    pool: commit.pool,
                    // hacky solution while I wait for chris to push commitID
                    commitID: index,
                });
            });

            return parsedCommits;
        })
        .catch((err) => {
            console.error('Failed to fetch commits', err);
            return [];
        });
    return tracerCommits;
};

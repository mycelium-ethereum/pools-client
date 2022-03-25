import { constructCommitID } from '@context/UsersCommitContext/commitDispatch';
import { ARBITRUM, ARBITRUM_RINKEBY, CommitTypeMap } from '@libs/constants';
import { CommitEnum } from '@tracer-protocol/pools-js';

export type SourceType = typeof ARBITRUM_RINKEBY | typeof ARBITRUM;

const query: (props: { pool?: string; account?: string; from?: number }) => string = ({ pool, account, from }) => `{
    commits (where: { 
        ${!!pool ? `pool: "${pool.toLowerCase()}",` : ''}
        ${!!account ? `trader: "${account.toLowerCase()}",` : ''}
        ${!!from ? `created_gt: ${from},` : ''}
    }) {
        id
        type
        txnHash
        amount
        pool
        created
        trader
        upkeep {
          longTokenPrice
          longTokenPriceRaw
          shortTokenPrice
          shortTokenPrice
        }
      }
}`;

type GraphCommitType = 'ShortMint' | 'ShortBurn' | 'LongMint' | 'LongBurn' | 'LongBurnShortMint' | 'ShortBurnLongMint';

export type GraphCommit = {
    id: string;
    type: GraphCommitType;
    amount: string;
    pool: string;
    trader: string;
    created: string;
    txnHash: string;
    upkeep: {
        longTokenPrice: string;
        longTokenPriceRaw: string;
        shortTokenPrice: string;
    };
};

export type APICommitReturn = {
    amount: string; // unparsed amount
    commitType: CommitEnum;
    txnHash: string;
    timestamp: number; // seconds
    from: string;
    commitID: string;
    pool: string; // pool address
};

const V2_GRAPH_URI_TESTNET = 'https://api.thegraph.com/subgraphs/name/scaredibis/tracer-pools-v2-arbitrum-rinkeby';

export const fetchPoolCommits: (
    network: SourceType,
    params: {
        pool?: string;
        from?: number;
        to?: number;
        account?: string;
    },
) => Promise<APICommitReturn[]> = async (_network, { pool, account, from }) => {
    // unfortunately for now we will just sacrifice the network param (will only query testnet)
    // committing will not even work on mainnet since the abi's differ
    const tracerCommits = await fetch(V2_GRAPH_URI_TESTNET, {
        method: 'POST',
        body: JSON.stringify({
            query: query({ pool, account, from }),
        }),
    })
        .then((res) => res.json())
        .then((allCommits) => {
            const parsedCommits: APICommitReturn[] = [];

            allCommits.data.commits.forEach((commit: GraphCommit) => {
                parsedCommits.push({
                    amount: commit.amount,
                    commitType: CommitTypeMap[commit.type],
                    from: commit.trader,
                    txnHash: commit.txnHash,
                    timestamp: parseInt(commit.created),
                    pool: commit.pool,
                    commitID: constructCommitID(commit.txnHash),
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

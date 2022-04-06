
import { V2_SUPPORTED_NETWORKS } from './types';

export const subgraphUrlByNetwork: Record<V2_SUPPORTED_NETWORKS, string> = {
    '42161': '',
    '421611': 'https://api.thegraph.com/subgraphs/name/scaredibis/tracer-pools-v2-arbitrum-rinkeby'
}

export const pendingCommitsQuery: (props: { pool?: string; account?: string }) => string = ({ pool, account }) => `{
    commits (where: {
        isExecuted: false
        ${!!pool ? `pool: "${pool.toLowerCase()}",` : ''}
        ${!!account ? `trader: "${account.toLowerCase()}",` : ''}
    }) {
        id
        type
        txnHash
        amount
        pool
        created
        trader
        updateIntervalId
    }
}`;

export const last2UpkeepsQuery: ({ poolAddress }: { poolAddress: string }) => string = ({ poolAddress }) => `{
    upkeeps (
        where: { pool: "${poolAddress.toLowerCase()}"}
        first: 2
        orderBy: timestamp
        orderDirection: desc
    ) {
        id
        longBalance
        shortBalance
        longTokenSupply
        shortTokenSupply
        startPrice
        endPrice
        timestamp
    }
}`;
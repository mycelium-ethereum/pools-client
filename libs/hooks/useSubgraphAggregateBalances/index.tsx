import { useMemo, useState } from 'react';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { knownNetworkToSubgraphUrl, networkConfig } from '@context/Web3Context/Web3Context.Config';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

type SubgraphAggregateBalances = Record<
    string,
    {
        longTokenHolding: BigNumber;
        longTokenAvgBuyIn: BigNumber;
        shortTokenHolding: BigNumber;
        shortTokenAvgBuyIn: BigNumber;
    }
>;

type ExepcetedGraphResponse = {
    longTokenAvgBuyIn: string;
    longTokenHolding: string;
    shortTokenHolding: string;
    shortTokenAvgBuyIn: string;
    pool: {
        id: string;
        quoteTokenDecimals: string;
    };
};

const fetchSubgraphAggregateBalance: (
    network: KnownNetwork,
    account: string,
) => Promise<SubgraphAggregateBalances> = async (network, account) => {
    const graphUrl = knownNetworkToSubgraphUrl[network];
    if (!graphUrl) {
        console.error(`No subgraph for network ${networkConfig[network].name}`);
        return {};
    }

    const data = {
        query: `{
          userAggregateBalances(where: { trader: "${account}" }) {
              longTokenAvgBuyIn
              longTokenHolding
              shortTokenHolding
              shortTokenAvgBuyIn
              pool {
                  id
                  quoteTokenDecimals
              }
          }
      }`,
    };
    const response = await fetch(graphUrl, {
        method: 'POST',
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .catch((err) => {
            console.error('Failed to fetch aggregate balances', err);
            return {};
        });

    if (response?.data?.userAggregateBalances) {
        const balances = response.data.userAggregateBalances;
        const poolAggregateBalances: SubgraphAggregateBalances = {};
        balances.map((balance: ExepcetedGraphResponse) => {
            const decimals = parseInt(balance.pool.quoteTokenDecimals);
            poolAggregateBalances[balance.pool.id] = {
                longTokenHolding: new BigNumber(ethers.utils.formatUnits(balance.longTokenHolding, decimals)),
                shortTokenHolding: new BigNumber(ethers.utils.formatUnits(balance.shortTokenHolding, decimals)),
                longTokenAvgBuyIn: new BigNumber(ethers.utils.formatUnits(balance.longTokenAvgBuyIn, decimals)),
                shortTokenAvgBuyIn: new BigNumber(ethers.utils.formatUnits(balance.shortTokenAvgBuyIn, decimals)),
            };
        });
        return poolAggregateBalances;
    } else {
        return {};
    }
};

export default (() => {
    const { account, network } = useWeb3();
    const [aggregateBalances, setAggregateBalances] = useState({});
    useMemo(() => {
        if (!!account && !!network) {
            fetchSubgraphAggregateBalance(network, account).then((aggregateBalances_) =>
                setAggregateBalances(aggregateBalances_),
            );
        }
    }, [network, account]);

    return aggregateBalances;
}) as () => SubgraphAggregateBalances;

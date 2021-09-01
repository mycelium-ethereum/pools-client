import  { useState, useMemo } from 'react';
import { usePools } from "@context/PoolContext";
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { SHORT_MINT, SHORT_BURN } from '@libs/constants';
import { QueuedCommit } from '@libs/types/General';
import { calcTokenPrice } from '@libs/utils/calcs';
import { useCommits } from '@context/UsersCommitContext';

export default (() => {
	const { account, provider } = useWeb3();
	const { commits = {} } = useCommits();
	const { pools } = usePools();
	const [allQueuedCommits, setAllQueuedCommits] = useState<QueuedCommit[]>([])
	
	useMemo(() => {
		// filter user commits
		if (pools && Object.keys(pools).length && provider && account) {
			setAllQueuedCommits(
				Object.values(commits).map((commit) => {
					const { 
						shortToken, 
						longToken, 
						shortBalance, 
						longBalance,
						lastUpdate,
						updateInterval
					} = pools[commit.pool]

					let token, tokenPrice;

					if (commit.type === SHORT_MINT || commit.type === SHORT_BURN) {
						token = shortToken;
						tokenPrice = calcTokenPrice(shortBalance, shortToken.supply)
					} else {
						token = longToken;
						tokenPrice = calcTokenPrice(longBalance, longToken.supply)
					}
					return ({
						token,
						tokenPrice,
						spent: commit.amount.times(tokenPrice),
						amount: commit.amount,
						nextRebalance: lastUpdate.plus(updateInterval) 
					})
				})
			)
		}
	}, [pools, commits, provider])

	return allQueuedCommits;
})
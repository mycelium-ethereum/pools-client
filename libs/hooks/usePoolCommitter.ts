import { useEffect, useMemo, useState } from 'react';
import { PoolCommitter, PoolCommitter__factory } from '@libs/types/typechain';
import { ethers, BigNumber as EthersBigNumber } from 'ethers';
import { BigNumber } from 'bignumber.js';
import { LONG_BURN, LONG_MINT, SHORT_BURN, SHORT_MINT } from '@libs/constants';
import { useWeb3 } from '@context/Web3Context/Web3Context';

type CommitterState = {
	pendingLong: BigNumber,
	pendingShort: BigNumber,
}


const defaultState: CommitterState = {
	pendingLong: new BigNumber(0),
	pendingShort: new BigNumber(0)
}

/**
 * Hook which can be used to fetch all the pending commits
 * 
 * @param committer address
 */
export const usePoolCommitter: (
	committer: string | undefined
) => CommitterState = (
	committer
) => {
	const { provider } = useWeb3();
	const [contract, setContract] = useState<PoolCommitter | undefined>(undefined)
	const [pendingLong, setPendingLong] = useState<BigNumber>(defaultState.pendingLong)
	const [pendingShort, setPendingShort] = useState<BigNumber>(defaultState.pendingShort)

	useEffect(() => {
		if (committer && provider) {
			let contract = new ethers.Contract(
					committer,
					PoolCommitter__factory.abi,
					provider
				) as PoolCommitter
			setContract(
				contract
			)
			subscribe()
		}
	}, [committer, provider])

	useEffect(() => {
		// fetch all pending committs
		const fetch = async () => {
			const earliestUnexecuted = await contract?.earliestCommitUnexecuted()
			// once we have this we can get the block number and query all commits from that block number
			const earliestUnexecutedCommit = (await contract?.queryFilter(contract.filters.CreateCommit(earliestUnexecuted?.toNumber())))?.[0]
			console.log("Id", earliestUnexecuted?.toNumber())
			console.log("event", earliestUnexecutedCommit)
			// these will be in ordered from newest to oldest
			const allUnexecutedCommits = await contract?.queryFilter(contract.filters.CreateCommit(), earliestUnexecutedCommit?.blockNumber) 
			console.log("All unexecuted commits", allUnexecutedCommits);
			let pendingLong_ = new BigNumber(0);
			let pendingShort_ = new BigNumber(0);
			allUnexecutedCommits?.forEach((commit) => {
				[pendingShort_, pendingLong_] = addToPending(pendingShort_, pendingLong_, {
					amount: commit.args.amount,
					type: commit.args.commitType
				})
			})
			console.log(`Pending commit amounts. Long: ${pendingLong_.toNumber()}, short: ${pendingShort_.toNumber()}` )
			setPendingLong(pendingLong_)
			setPendingShort(pendingShort_)
		}
		if (contract) {
			fetch()
		}
	}, [contract])

	useEffect(() => {
		if (provider && contract) {
			const newContract = contract.connect(provider)
			setContract(newContract)
			subscribe();
		}
	}, [provider])

	useEffect(() => {
		if (contract) {
			subscribe();
		}
		return () => {
			unsubscribe();
		}

	}, [contract])

	const unsubscribe = () => {
		console.log("Unsibscribing contract events")
		contract?.removeAllListeners("CreateCommit")
		contract?.removeAllListeners("ExecuteCommit")
		contract?.removeAllListeners("RemoveCommit")
		contract?.removeAllListeners("FailedCommitExecution")
	}

	const subscribe = async () => {
		contract?.on('CreateCommit', (id, amount, type) => {
			console.debug("Commit created", {
				id, amount, type 
			})
			const [pendingShort_, pendingLong_] = addToPending(pendingShort, pendingLong, {
				amount,
				type 
			})
			!pendingShort_.eq(pendingShort) // set short if short changed else set long
				? setPendingShort(pendingShort_)
				: setPendingLong(pendingLong_)
		})

		contract?.on('ExecuteCommit', (id, amount, type) => {
			console.debug("Commit executed", {
				id, amount, type 
			})
			const [pendingShort_, pendingLong_] = addToPending(pendingShort, pendingLong, {
				amount,
				type
			})
			!pendingShort_.eq(pendingShort) // set short if short changed else set long
				? setPendingShort(pendingShort_)
				: setPendingLong(pendingLong_)
		});

		contract?.on('RemoveCommit', (id, amount, type) => {
			console.debug("Commit deleted", {
				id, amount, type
			})
			const [pendingShort_, pendingLong_] = addToPending(pendingShort, pendingLong, {
				amount,
				type	
			})
			!pendingShort_.eq(pendingShort) // set short if short changed else set long
				? setPendingShort(pendingShort_)
				: setPendingLong(pendingLong_)
		});
		contract?.on('FailedCommitExecution', () => {
			console.debug("Failed to execute commit");
		});
	}

	const poolCommitter = useMemo(() => ({
		pendingLong,
		pendingShort
	}), [pendingLong, pendingShort])

	return poolCommitter;
}

const addToPending: (
	pendingShort: BigNumber, pendingLong: BigNumber, commit: {
		amount: EthersBigNumber,
		type: number 
	}
) => [short: BigNumber, long: BigNumber] = (
	pendingShort, pendingLong, commit
) => {
	switch (commit.type) {
		case SHORT_MINT:
			return [pendingShort.plus(new BigNumber(ethers.utils.formatEther(commit.amount))), pendingLong]
		case SHORT_BURN:
			return [pendingShort.minus(new BigNumber(ethers.utils.formatEther(commit.amount))), pendingLong]
		case LONG_MINT:
			return [pendingShort, pendingLong.plus(new BigNumber(ethers.utils.formatEther(commit.amount)))]
		case LONG_BURN:
			return [pendingShort, pendingLong.minus(new BigNumber(ethers.utils.formatEther(commit.amount)))]
		default:
			return [pendingShort, pendingLong]
	}
}


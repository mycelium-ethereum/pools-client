import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import shallow from 'zustand/shallow';
import { PoolCommitter__factory, PoolToken__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import {
    CommitEnum,
    encodeCommitParams,
    BalanceTypeEnum,
    getExpectedExecutionTimestamp,
} from '@tracer-protocol/pools-js';
import { CommitToQueryFocusMap } from '~/constants/index';
import { useStore } from '~/store/main';
import { selectAddCommit } from '~/store/PendingCommitSlice';
import {
    selectPoolInstanceActions,
    selectPoolInstances,
    selectPoolInstanceUpdateActions,
} from '~/store/PoolInstancesSlice';
import { selectHandleTransaction } from '~/store/TransactionSlice';
import { TransactionType } from '~/store/TransactionSlice/types';
import { selectWeb3Info } from '~/store/Web3Slice';
import { fromAggregateBalances } from '~/utils/pools';

type Options = {
    onSuccess?: (...args: any) => any;
};

interface PoolInstanceActions {
    commit: (
        pool: string,
        commitType: CommitEnum,
        balanceType: BalanceTypeEnum,
        amount: BigNumber,
        options?: Options,
    ) => Promise<void>;
    approve: (pool: string, settlementTokenSymbol: string) => void;
    claim: (pool: string, options?: Options) => void;
    commitGasFee: (
        pool: string,
        commitType: CommitEnum,
        balanceType: BalanceTypeEnum,
        amount: BigNumber,
    ) => Promise<BigNumber>;
}

const committerInterface = new ethers.utils.Interface(PoolCommitter__factory.abi);

export const usePoolInstanceActions = (): PoolInstanceActions => {
    const { setTokenApproved } = useStore(selectPoolInstanceActions, shallow);
    const { updatePoolTokenBalances, updateSettlementTokenBalances, simulateUpdateAvgEntryPrices } = useStore(
        selectPoolInstanceUpdateActions,
        shallow,
    );
    const addCommit = useStore(selectAddCommit);
    const handleTransaction = useStore(selectHandleTransaction);
    const { provider, account, signer } = useStore(selectWeb3Info, shallow);
    const pools = useStore(selectPoolInstances);

    /**
     * Claim all pending commits
     * @param pool pool address to claim from
     * @param options handleTransaction options
     */
    const claim: PoolInstanceActions['claim'] = async (pool, options) => {
        const {
            name: poolName,
            committer: { address: committerAddress },
        } = pools[pool].poolInstance;

        if (!committerAddress) {
            console.error('Failed to claim: Committer address undefined');
            // TODO handle error
        }
        if (!account) {
            console.error('Failed to claim: Account undefined');
            return;
        }
        if (!signer) {
            console.error('Signer undefined when trying to claim');
            return;
        }
        const committer = PoolCommitter__factory.connect(committerAddress, signer);
        if (handleTransaction) {
            handleTransaction({
                callMethod: committer.claim,
                params: [account],
                type: TransactionType.CLAIM,
                injectedProps: {
                    poolName,
                },
                callBacks: {
                    onSuccess: (receipt) => {
                        console.debug('Successfully submitted claim txn: ', receipt);
                        // get and set token balances
                        updatePoolTokenBalances([pool], provider, account);
                        updateSettlementTokenBalances([pool], provider, account);
                        // simulate claim for aggregatebalances
                        // this is because the graph can be delayed in picking up the claim
                        simulateUpdateAvgEntryPrices(pool);
                        options?.onSuccess ? options.onSuccess(receipt) : null;
                    },
                },
            });
        }
    };

    // returns the cost of gas units
    const commitGasFee: PoolInstanceActions['commitGasFee'] = async (pool = '', commitType, balanceType, amount) => {
        if (amount.eq(0)) {
            throw 'Failed to estimate gas cost: amount cannot be 0';
        }

        const committerAddress = pools[pool]?.poolInstance?.committer?.address;

        if (!committerAddress) {
            throw 'Committer address undefined when trying to commit';
        }

        if (!signer) {
            throw 'Signer undefined when trying to commit';
        }
        const committer = PoolCommitter__factory?.connect(committerAddress, signer);

        try {
            const gasEstimate = await committer?.estimateGas?.commit(
                encodeCommitParams(
                    false,
                    fromAggregateBalances(balanceType),
                    commitType,
                    ethers.utils.parseUnits(amount?.toFixed(), 18),
                ),
            );
            const formattedGasEstimate = new BigNumber(gasEstimate.toString());
            return formattedGasEstimate;
        } catch (err) {
            throw `Failed to estimate gas cost: ${err}`;
        }
    };

    /**
     * Commit to a pool
     * @param pool pool address to commit to
     * @param commitType int corresponding to commitType
     * @param amount amount to commit
     * @param options handleTransaction options
     */
    const commit: PoolInstanceActions['commit'] = async (pool, commitType, balanceType, amount, options) => {
        const {
            lastUpdate,
            updateInterval,
            frontRunningInterval,
            address: poolAddress,
            committer: { address: committerAddress },
            settlementToken: { decimals: settlementTokenDecimals },
            longToken: { symbol: longTokenSymbol },
            shortToken: { symbol: shortTokenSymbol },
        } = pools[pool].poolInstance;
        const expectedExecution = getExpectedExecutionTimestamp(
            frontRunningInterval.toNumber(),
            updateInterval.toNumber(),
            lastUpdate.toNumber(),
            Math.floor(Date.now() / 1000),
        );

        if (!committerAddress) {
            console.error('Committer address undefined when trying to commit');
            // TODO handle error
        }
        if (!signer) {
            console.error('Signer undefined when trying to commit');
            return;
        }
        const committer = PoolCommitter__factory.connect(committerAddress, signer);
        console.debug(
            `Creating commit. Amount: ${ethers.utils.parseUnits(
                amount.toFixed(),
                settlementTokenDecimals,
            )}, Raw amount: ${amount.toFixed()}`,
        );
        if (handleTransaction) {
            handleTransaction({
                callMethod: committer.commit,
                params: [
                    encodeCommitParams(
                        false,
                        fromAggregateBalances(balanceType),
                        commitType,
                        ethers.utils.parseUnits(amount.toFixed(), settlementTokenDecimals),
                    ),
                ],
                type: TransactionType.COMMIT,
                injectedProps: {
                    poolAddress,
                    provider: provider as ethers.providers.JsonRpcProvider,
                    tokenSymbol: commitType === CommitEnum.longMint ? longTokenSymbol : shortTokenSymbol,
                    commitType: CommitToQueryFocusMap[commitType],
                    settlementTokenDecimals,
                    expectedExecution: expectedExecution,
                },
                callBacks: {
                    onSuccess: (receipt) => {
                        console.debug('Successfully submitted commit txn: ', receipt);
                        updatePoolTokenBalances([pool], provider, account);
                        updateSettlementTokenBalances([pool], provider, account);
                        options?.onSuccess ? options.onSuccess(receipt) : null;
                        // @ts-ignore receipt type is a bitch
                        const txnHash = (receipt as any)?.transactionHash ?? '';
                        const parsedLogs = (receipt as any)?.logs?.map((log: any) => {
                            try {
                                return committerInterface.parseLog(log);
                            } catch (_err) {
                                return undefined;
                            }
                        });
                        const createdCommit = parsedLogs?.find((log: any) => log?.name === 'CreateCommit');
                        if (!!createdCommit) {
                            const commitInfo = createdCommit.args;
                            addCommit({
                                pool: pool.slice(),
                                txnHash: txnHash as string,
                                id: txnHash,
                                type: commitType,
                                amount: new BigNumber(
                                    ethers.utils.formatUnits(commitInfo.amount, settlementTokenDecimals),
                                ),
                                from: commitInfo.user,
                                created: Math.floor(Date.now() / 1000),
                                appropriateIntervalId: commitInfo.appropriateUpdateIntervalId.toNumber(),
                            });
                        }
                    },
                },
            });
        }
    };

    const approve: PoolInstanceActions['approve'] = async (pool, settlementTokenSymbol) => {
        if (!signer) {
            console.error('Failed to approve token: signer undefined');
            return;
        }

        const token = PoolToken__factory.connect(pools[pool].poolInstance.settlementToken.address, signer);

        if (handleTransaction) {
            handleTransaction({
                callMethod: token.approve,
                params: [pool, ethers.utils.parseEther(Number.MAX_SAFE_INTEGER.toString())],
                type: TransactionType.APPROVE,
                injectedProps: {
                    tokenSymbol: settlementTokenSymbol,
                },
                callBacks: {
                    onSuccess: async (receipt) => {
                        console.debug('Successfully approved token', receipt);
                        setTokenApproved(pool, 'settlementToken', new BigNumber(Number.MAX_SAFE_INTEGER));
                    },
                },
            });
        }
    };
    return {
        commit,
        approve,
        claim,
        commitGasFee,
    };
};

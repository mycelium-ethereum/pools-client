import { ContractReceipt, ethers } from 'ethers';
import { PoolCommitter, PoolToken } from '@tracer-protocol/perpetual-pools-contracts/types';
import { Result } from '@libs/types/General';
import { QueryFocus } from '@libs/constants';

export enum TransactionType {
    // STAKE = 'STAKE',
    COMMIT = 'COMMIT',
    CLAIM = 'CLAIM',
    APPROVE = 'APPROVE',
    DEFAULT = 'DEFAULT',
}

type Commit = PoolCommitter['commit'];
type Approve = PoolToken['approve'];
type Claim = PoolCommitter['claim'];

// if adding a supportFunction ensure you add to the following
// GetInjectedSuccessProps
// GetTransactionType
// AllTransactionParams
export type SupportedFunctions = Commit | Claim | Approve;

type ApproveProps = {
    tokenSymbol: string;
};

export type CommitProps = {
    provider: ethers.providers.Provider;
    poolAddress: string;
    tokenSymbol: string;
    settlementTokenDecimals: number;
    commitType: QueryFocus;
    nextRebalance: number;
};

export type ClaimProps = {
    poolName: string;
};

type GetInjectedSuccessProps<P extends TransactionType> = P extends TransactionType.APPROVE
    ? ApproveProps
    : P extends TransactionType.COMMIT
    ? CommitProps
    : P extends TransactionType.CLAIM
    ? ClaimProps
    : P extends TransactionType.DEFAULT
    ? undefined
    : never;

type GetTransactionType<F extends SupportedFunctions> = F extends Approve
    ? TransactionType.APPROVE
    : F extends Commit
    ? TransactionType.COMMIT
    : F extends Claim
    ? TransactionType.CLAIM
    : TransactionType.DEFAULT;

export type Callbacks = {
    onSuccess?: (receipt?: ContractReceipt | Result) => any; // eslint-disable-line
    onError?: (error?: Error | Result) => any;
    afterConfirmation?: (hash: string) => any;
};

export interface TransactionParams<F extends SupportedFunctions> {
    callMethod: F;
    params: Parameters<F>;
    type: GetTransactionType<this['callMethod']>;
    injectedProps: GetInjectedSuccessProps<this['type']>;
    callBacks?: Callbacks;
}

export type AllTransactionParams = TransactionParams<Approve> | TransactionParams<Commit> | TransactionParams<Claim>;

export interface ITransactionSlice {
    pendingCount: number;
    handleTransaction: ((props: AllTransactionParams) => void) | undefined;
}

import { ContractReceipt, ethers } from 'ethers';
import { PoolCommitter, PoolToken } from '@tracer-protocol/perpetual-pools-contracts/types';
import { Result } from '@libs/types/General';
import { QueryFocus } from '@libs/constants';
import { ArbSys, L1GatewayRouter, L2GatewayRouter } from 'arb-ts/dist/lib/abi';
import { Inbox } from 'arb-ts/dist/lib/abi/Inbox';

export enum TransactionType {
    // STAKE = 'STAKE',
    COMMIT = 'COMMIT',
    CLAIM = 'CLAIM',
    APPROVE = 'APPROVE',
    ARB_ETH_DEPOSIT = 'ARB_ETH_DEPOSIT',
    ARB_BRIDGE = 'ARB_BRIDGE',
    DEFAULT = 'DEFAULT',
}

type Commit = PoolCommitter['commit'];
type Approve = PoolToken['approve'];
type Claim = PoolCommitter['claim'];
type ArbBridgeETHDeposit =
    | ArbSys['withdrawEth'] //deposit eth l1
    | Inbox['depositEth']; // deposit eth l2
type ArbBridgeBridge =
    | L2GatewayRouter['functions']['outboundTransfer(address,address,uint256,bytes)'] // l2 to l1
    | L1GatewayRouter['outboundTransfer']; // l1 to l2

// if adding a supportFunction ensure you add to the following
// GetInjectedSuccessProps
// AllTransactionParams
export type SupportedFunctions = Commit | Claim | Approve | ArbBridgeETHDeposit | ArbBridgeBridge;

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

type ArbBridgeProps = {
    tokenSymbol: string;
    networkName: string;
    type: 'withdrawal' | 'deposit';
};

type GetInjectedSuccessProps<P extends TransactionType> = P extends TransactionType.APPROVE
    ? ApproveProps
    : P extends TransactionType.COMMIT
    ? CommitProps
    : P extends TransactionType.CLAIM
    ? ClaimProps
    : P extends TransactionType.ARB_BRIDGE
    ? ArbBridgeProps
    : P extends TransactionType.ARB_ETH_DEPOSIT
    ? ArbBridgeProps
    : P extends TransactionType.DEFAULT
    ? undefined
    : never;

export type Callbacks = {
    onSuccess?: (receipt?: ContractReceipt | Result) => any; // eslint-disable-line
    onError?: (error?: Error | Result) => any;
    afterConfirmation?: (hash: string) => any;
};

export interface TransactionParams<F extends SupportedFunctions, T extends TransactionType> {
    callMethod: F;
    params: Parameters<F>;
    type: T;
    injectedProps: GetInjectedSuccessProps<this['type']>;
    callBacks?: Callbacks;
}

export type AllTransactionParams =
    | TransactionParams<Approve, TransactionType.APPROVE>
    | TransactionParams<Commit, TransactionType.COMMIT>
    | TransactionParams<Claim, TransactionType.CLAIM>
    | TransactionParams<ArbBridgeETHDeposit, TransactionType.ARB_ETH_DEPOSIT>
    | TransactionParams<ArbBridgeBridge, TransactionType.ARB_BRIDGE>;

export interface ITransactionSlice {
    pendingCount: number;
    handleTransaction: ((props: AllTransactionParams) => void) | undefined;
}

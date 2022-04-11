import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { TableRow, TableRowCell } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { QueuedCommit } from '~/types/commits';
import { toApproxCurrency } from '~/utils/converters';
import { ReceiveIn } from './ReceiveIn';
import { Market, MarketPrice } from '../Market';
import { TokensAt, TokensNotional } from '../Tokens';

type QueuedCommitRowProps = QueuedCommit & {
    provider: ethers.providers.JsonRpcProvider | null;
};

export const MintCommitRow = ({
    tokenOut,
    txnHash,
    tokenPrice,
    amount,
    provider,
    settlementTokenSymbol,
    expectedExecution,
}: QueuedCommitRowProps): JSX.Element => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <Market tokenSymbol={tokenOut.symbol} isLong={tokenOut.side === SideEnum.long} />
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(amount)}</TableRowCell>
            <TableRowCell>
                <TokensAt amount={amount.div(tokenPrice)} price={tokenPrice} tokenSymbol={settlementTokenSymbol} />
            </TableRowCell>
            <TableRowCell>
                <ReceiveIn
                    pendingUpkeep={pendingUpkeep}
                    setPendingUpkeep={setPendingUpkeep}
                    actionType={CommitActionEnum.mint}
                    expectedExecution={expectedExecution}
                />
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={tokenOut}
                    provider={provider}
                    arbiscanTarget={{
                        type: BlockExplorerAddressType.txn,
                        target: txnHash,
                    }}
                />
            </TableRowCell>
        </TableRow>
    );
};

export const BurnCommitRow = ({
    tokenOut,
    txnHash,
    tokenPrice,
    amount,
    provider,
    settlementTokenSymbol,
    expectedExecution,
}: QueuedCommitRowProps): JSX.Element => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <Market tokenSymbol={tokenOut.symbol} isLong={tokenOut.side === SideEnum.long} />
            </TableRowCell>
            <TableRowCell>{amount.toFixed(2)} tokens</TableRowCell>
            <TableRowCell>
                <TokensAt amount={amount.times(tokenPrice)} price={tokenPrice} tokenSymbol={settlementTokenSymbol} />
            </TableRowCell>
            <TableRowCell>
                <ReceiveIn
                    pendingUpkeep={pendingUpkeep}
                    setPendingUpkeep={setPendingUpkeep}
                    actionType={CommitActionEnum.mint}
                    expectedExecution={expectedExecution}
                />
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={tokenOut}
                    provider={provider}
                    arbiscanTarget={{
                        type: BlockExplorerAddressType.txn,
                        target: txnHash,
                    }}
                />
            </TableRowCell>
        </TableRow>
    );
};

export const FlipCommitRow = ({
    tokenIn,
    tokenOut,
    txnHash,
    tokenPrice,
    amount,
    provider,
    settlementTokenSymbol,
    expectedExecution,
}: QueuedCommitRowProps): JSX.Element => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <MarketPrice tokenSymbol={tokenIn.symbol} tokenPrice={tokenPrice} />
            </TableRowCell>
            <TableRowCell>
                <TokensNotional amount={amount} price={tokenPrice} tokenSymbol={settlementTokenSymbol} />
            </TableRowCell>
            <TableRowCell>
                <MarketPrice tokenSymbol={tokenIn.symbol} tokenPrice={tokenPrice} />
            </TableRowCell>
            <TableRowCell>
                <TokensNotional amount={amount} price={tokenPrice} tokenSymbol={settlementTokenSymbol} />
            </TableRowCell>
            <TableRowCell>
                <ReceiveIn
                    pendingUpkeep={pendingUpkeep}
                    setPendingUpkeep={setPendingUpkeep}
                    actionType={CommitActionEnum.mint}
                    expectedExecution={expectedExecution}
                />
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={tokenOut}
                    provider={provider}
                    arbiscanTarget={{
                        type: BlockExplorerAddressType.txn,
                        target: txnHash,
                    }}
                />
            </TableRowCell>
        </TableRow>
    );
};

export const QueuedCommitRow = ({
    focus,
    ...props
}: QueuedCommitRowProps & { focus: CommitActionEnum }): JSX.Element => {
    if (focus === CommitActionEnum.mint) {
        return <MintCommitRow {...props} />;
    } else if (focus === CommitActionEnum.burn) {
        return <BurnCommitRow {...props} />;
    } else if (focus === CommitActionEnum.flip) {
        return <FlipCommitRow {...props} />;
    } else {
        return <></>;
    }
};

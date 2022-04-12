import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
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
    tokenIn: { amount: tokenInAmount },
    tokenOut,
    txnHash,
    isLong,
    provider,
    settlementTokenSymbol,
    expectedExecution,
}: QueuedCommitRowProps): JSX.Element => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <Market tokenSymbol={tokenOut.symbol} isLong={isLong} />
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(tokenInAmount)}</TableRowCell>
            <TableRowCell>
                <TokensAt
                    amount={tokenInAmount.div(tokenOut.price)}
                    price={tokenOut.price}
                    tokenSymbol={settlementTokenSymbol}
                />
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
    tokenIn,
    txnHash,
    isLong,
    provider,
    settlementTokenSymbol,
    expectedExecution,
}: QueuedCommitRowProps): JSX.Element => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);
    const { amount: tokenInAmount, symbol: tokenInSymbol, price: tokenInPrice } = tokenIn;
    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <Market tokenSymbol={tokenInSymbol} isLong={isLong} />
            </TableRowCell>
            <TableRowCell>{tokenInAmount.toFixed(2)} tokens</TableRowCell>
            <TableRowCell>
                <TokensAt
                    amount={tokenInAmount.times(tokenInPrice)}
                    price={tokenInPrice}
                    tokenSymbol={settlementTokenSymbol}
                />
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
                    token={tokenIn}
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
    tokenIn: { amount: tokenInAmount, symbol: tokenInSymbol, price: tokenInPrice },
    tokenOut,
    txnHash,
    provider,
    settlementTokenSymbol,
    expectedExecution,
}: QueuedCommitRowProps): JSX.Element => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);
    const { amount: tokenOutAmount, symbol: tokenOutSymbol, price: tokenOutPrice } = tokenOut;

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <MarketPrice tokenSymbol={tokenInSymbol} tokenPrice={tokenInPrice} />
            </TableRowCell>
            <TableRowCell>
                <TokensNotional amount={tokenInAmount} price={tokenInPrice} tokenSymbol={settlementTokenSymbol} />
            </TableRowCell>
            <TableRowCell>
                <MarketPrice tokenSymbol={tokenOutSymbol} tokenPrice={tokenOutPrice} />
            </TableRowCell>
            <TableRowCell>
                <TokensNotional amount={tokenOutAmount} price={tokenOutPrice} tokenSymbol={settlementTokenSymbol} />
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

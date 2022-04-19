import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { TableRow, TableRowCell } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import { CommitTypeName } from '~/constants/commits';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { QueuedCommit } from '~/types/commits';
import { ReceiveIn } from './ReceiveIn';
import { Amount, TokenPrice, TokenSymbol } from '../../Market';

type QueuedCommitRowProps = QueuedCommit & {
    provider: ethers.providers.JsonRpcProvider | null;
};

export const QueuedCommitRow = ({
    tokenIn,
    tokenOut,
    txnHash,
    type,
    provider,
    expectedExecution,
}: QueuedCommitRowProps): JSX.Element => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);
    const { amount: tokenInAmount, symbol: tokenInSymbol, price: tokenInPrice, isLong: tokenInIslong } = tokenIn;
    const { amount: tokenOutAmount, symbol: tokenOutSymbol, price: tokenOutPrice, isLong: tokenOutIsLong } = tokenOut;
    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>{CommitTypeName[type]}</TableRowCell>
            <TableRowCell>
                <Amount tokenSymbol={tokenInSymbol} amount={tokenInAmount} />
            </TableRowCell>
            <TableRowCell>
                <TokenSymbol tokenSymbol={tokenInSymbol} isLong={tokenInIslong} />
            </TableRowCell>
            <TableRowCell>
                <TokenPrice
                    tokenInSymbol={tokenInSymbol}
                    tokenOutSymbol={tokenOutSymbol}
                    price={tokenOutPrice.div(tokenInPrice)}
                />
            </TableRowCell>
            <TableRowCell>
                <Amount tokenSymbol={tokenOutSymbol} amount={tokenOutAmount} />
            </TableRowCell>
            <TableRowCell>
                <TokenSymbol tokenSymbol={tokenInSymbol} isLong={tokenOutIsLong} />
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

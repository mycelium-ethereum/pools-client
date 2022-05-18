import React, { useState } from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { TableRow } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import { CommitTypeName } from '~/constants/commits';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { QueuedCommit } from '~/types/commits';
import { ReceiveIn } from './ReceiveIn';
import { Amount, TokenPrice, TokenSymbol } from '../Market';
import { ArrowRight, OverviewTableRowCell } from '../OverviewTable/styles';

type QueuedCommitRowProps = QueuedCommit;

export const QueuedCommitRow = ({
    tokenIn,
    tokenOut,
    txnHash,
    type,
    expectedExecution,
}: QueuedCommitRowProps): JSX.Element => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);
    const { amount: tokenInAmount, symbol: tokenInSymbol, price: tokenInPrice, isLong: tokenInIslong } = tokenIn;
    const { amount: tokenOutAmount, symbol: tokenOutSymbol, price: tokenOutPrice, isLong: tokenOutIsLong } = tokenOut;

    return (
        <TableRow key={txnHash} lined>
            <OverviewTableRowCell>{CommitTypeName[type]}</OverviewTableRowCell>
            <OverviewTableRowCell>
                <Amount tokenSymbol={tokenInSymbol} amount={tokenInAmount} />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <TokenSymbol tokenSymbol={tokenInSymbol} isLong={tokenInIslong} />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <ArrowRight />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <TokenPrice
                    tokenInSymbol={tokenInSymbol}
                    tokenOutSymbol={tokenOutSymbol}
                    price={tokenOutPrice.div(tokenInPrice)}
                />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <Amount tokenSymbol={tokenOutSymbol} amount={tokenOutAmount} />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <TokenSymbol tokenSymbol={tokenOutSymbol} isLong={tokenOutIsLong} />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <ReceiveIn
                    pendingUpkeep={pendingUpkeep}
                    setPendingUpkeep={setPendingUpkeep}
                    actionType={CommitActionEnum.mint}
                    expectedExecution={expectedExecution}
                />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <Actions
                    token={tokenOut}
                    arbiscanTarget={{
                        type: BlockExplorerAddressType.txn,
                        target: txnHash,
                    }}
                />
            </OverviewTableRowCell>
        </TableRow>
    );
};

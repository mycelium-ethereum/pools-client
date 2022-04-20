import React from 'react';
import { ethers } from 'ethers';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { TableRow } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import { CommitTypeName } from '~/constants/commits';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { TradeHistory } from '~/types/commits';
import { Amount, TokenPrice, TokenSymbol } from '../Market';
import { ArrowRight, OverviewTableRowCell } from '../OverviewTable/styles';

type HistoricCommitRowProps = TradeHistory & {
    provider?: ethers.providers.JsonRpcProvider;
};

export const HistoricCommitRow = ({
    txnHashIn,
    tokenOut: { amount: tokenOutAmount, symbol: tokenOutSymbol, price: tokenOutPrice, isLong: tokenOutIsLong },
    tokenIn: {
        address: tokenInAddress,
        amount: tokenInAmount,
        symbol: tokenInSymbol,
        price: tokenInPrice,
        isLong: tokenInIsLong,
    },
    settlementToken: { decimals: tokenDecimals },
    commitType,
    timeString,
    dateString,
    provider,
    txnHashOut,
    fee,
}: HistoricCommitRowProps): JSX.Element => (
    <TableRow key={`${txnHashIn}`} lined>
        <OverviewTableRowCell>{CommitTypeName[commitType]}</OverviewTableRowCell>
        <OverviewTableRowCell>
            <Amount tokenSymbol={tokenInSymbol} amount={tokenInAmount} />
        </OverviewTableRowCell>
        <OverviewTableRowCell>
            <TokenSymbol tokenSymbol={tokenInSymbol} isLong={tokenInIsLong} />
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
        <OverviewTableRowCell>{!fee.eq(0) ? `${fee.times(100).toFixed(2)}%` : '-'}</OverviewTableRowCell>
        <OverviewTableRowCell>
            <div>{timeString}</div>
            <div className="text-cool-gray-500">{dateString}</div>
        </OverviewTableRowCell>
        <OverviewTableRowCell>
            <Actions
                provider={provider as ethers.providers.JsonRpcProvider}
                token={{
                    address: tokenInAddress,
                    decimals: tokenDecimals,
                    symbol: tokenInSymbol,
                }}
                arbiscanTarget={{
                    type: BlockExplorerAddressType.token,
                    target: tokenInAddress,
                }}
                otherActions={[
                    {
                        type: BlockExplorerAddressType.txn,
                        target: txnHashIn,
                        logo: NETWORKS.ARBITRUM,
                        text: 'View Commit on Arbiscan',
                    },
                    {
                        type: BlockExplorerAddressType.txn,
                        target: txnHashOut,
                        logo: NETWORKS.ARBITRUM,
                        text: 'View Upkeep on Arbiscan',
                    },
                ]}
            />
        </OverviewTableRowCell>
    </TableRow>
);

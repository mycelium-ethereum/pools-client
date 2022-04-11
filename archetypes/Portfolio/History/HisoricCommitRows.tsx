import React from 'react';
import { ethers } from 'ethers';
import { CommitActionEnum, NETWORKS } from '@tracer-protocol/pools-js';
import { TableRow, TableRowCell } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { TradeHistory } from '~/types/commits';
import { toApproxCurrency } from '~/utils/converters';
import { Market, MarketPrice } from '../Market';
import { TokensAt, TokensNotional } from '../Tokens';

type HistoricCommitRowProps = TradeHistory & {
    provider?: ethers.providers.JsonRpcProvider;
};

export const HistoricMintCommitRow = ({
    tokenOut: { address: tokenOutAddress, symbol: tokenOutSymbol },
    tokenIn: { amount: tokenInAmount },
    settlementToken: { symbol: settlementTokenSymbol, decimals: tokenDecimals },
    isLong,
    inTokenPrice,
    timeString,
    dateString,
    fee,
    provider,
    txnHashIn,
    txnHashOut,
}: HistoricCommitRowProps): JSX.Element => {
    return (
        <TableRow key={`${txnHashIn}`} lined>
            {/*Time / Date*/}
            <TableRowCell>
                <div>{timeString}</div>
                <div className="text-cool-gray-500">{dateString}</div>
            </TableRowCell>
            {/*Token*/}
            <TableRowCell>
                <Market tokenSymbol={tokenOutSymbol} isLong={isLong} />
            </TableRowCell>
            {/*Amount*/}
            <TableRowCell>{toApproxCurrency(tokenInAmount)}</TableRowCell>
            {/*Tokens / Price*/}
            <TableRowCell>
                <TokensAt amount={tokenInAmount} price={inTokenPrice} tokenSymbol={settlementTokenSymbol} />
            </TableRowCell>
            {/*Protocol Fee*/}
            <TableRowCell>{`${fee.times(100).toNumber()}%`}</TableRowCell>
            <TableRowCell>
                <Actions
                    provider={provider as ethers.providers.JsonRpcProvider}
                    token={{
                        address: tokenOutAddress,
                        decimals: tokenDecimals,
                        symbol: tokenOutSymbol,
                    }}
                    arbiscanTarget={{
                        type: BlockExplorerAddressType.token,
                        target: tokenOutAddress,
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
            </TableRowCell>
        </TableRow>
    );
};

export const HistoricBurnCommitRow = ({
    txnHashIn,
    tokenIn: { address: tokenInAddress, amount: tokenInAmount, symbol: tokenInSymbol },
    settlementToken: { symbol: settlementTokenSymbol, decimals: tokenDecimals },
    isLong,
    inTokenPrice,
    timeString,
    dateString,
    provider,
    txnHashOut,
}: HistoricCommitRowProps): JSX.Element => {
    return (
        <TableRow key={`${txnHashIn}`} lined>
            <TableRowCell>
                <div>{timeString}</div>
                <div className="text-cool-gray-500">{dateString}</div>
            </TableRowCell>
            <TableRowCell>
                <Market tokenSymbol={tokenInSymbol} isLong={isLong} />
            </TableRowCell>
            <TableRowCell>
                <TokensAt amount={tokenInAmount} price={inTokenPrice} tokenSymbol={settlementTokenSymbol} />
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(inTokenPrice.times(tokenInAmount))}</TableRowCell>
            <TableRowCell>
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
            </TableRowCell>
        </TableRow>
    );
};

export const HistoricFlipCommitRow = ({
    txnHashIn,
    tokenOut: { amount: tokenOutAmount, symbol: tokenOutSymbol },
    tokenIn: { address: tokenInAddress, amount: tokenInAmount, symbol: tokenInSymbol },
    settlementToken: { symbol: settlementTokenSymbol, decimals: tokenDecimals },
    inTokenPrice,
    timeString,
    dateString,
    provider,
    txnHashOut,
}: HistoricCommitRowProps): JSX.Element => {
    const outTokenPrice = inTokenPrice.times(tokenInAmount).div(tokenOutAmount);
    return (
        <TableRow key={`${txnHashIn}`} lined>
            <TableRowCell>
                <div>{timeString}</div>
                <div className="text-cool-gray-500">{dateString}</div>
            </TableRowCell>
            <TableRowCell>
                <MarketPrice tokenSymbol={tokenInSymbol} tokenPrice={inTokenPrice} />
            </TableRowCell>
            <TableRowCell>
                <TokensNotional amount={tokenInAmount} price={inTokenPrice} tokenSymbol={settlementTokenSymbol} />
            </TableRowCell>
            <TableRowCell>
                <MarketPrice tokenSymbol={tokenOutSymbol} tokenPrice={outTokenPrice} />
            </TableRowCell>
            <TableRowCell>
                <TokensNotional amount={tokenOutAmount} price={outTokenPrice} tokenSymbol={settlementTokenSymbol} />
            </TableRowCell>
            <TableRowCell>
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
            </TableRowCell>
        </TableRow>
    );
};

export const HistoricCommitRow = ({
    focus,
    ...props
}: HistoricCommitRowProps & { focus: CommitActionEnum }): JSX.Element => {
    if (focus === CommitActionEnum.mint) {
        return <HistoricMintCommitRow {...props} />;
    } else if (focus === CommitActionEnum.burn) {
        return <HistoricBurnCommitRow {...props} />;
    } else if (focus === CommitActionEnum.flip) {
        return <HistoricFlipCommitRow {...props} />;
    } else {
        return <></>;
    }
};

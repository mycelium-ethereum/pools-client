import React from 'react';
import { ethers } from 'ethers';
import { CommitActionEnum, NETWORKS } from '@tracer-protocol/pools-js';
import { Logo, tokenSymbolToLogoTicker } from '~/components/General';
import { TableRow, TableRowCell } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { TradeHistory } from '~/types/commits';
import { toApproxCurrency } from '~/utils/converters';
import { Fee } from './Fee';
import { Market } from '../Market';

type HistoricCommitRowProps = TradeHistory & {
    provider?: ethers.providers.JsonRpcProvider;
};

export const HistoricMintCommitRow = ({
    tokenOut: { address: tokenOutAddress, symbol: tokenOutSymbol },
    tokenIn: { amount: tokenInAmount },
    settlementToken: { symbol: priceTokenSymbol, decimals: tokenDecimals },
    isLong,
    price,
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
                <div>{tokenInAmount.div(price).toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    at {toApproxCurrency(price)} {priceTokenSymbol}/token
                </div>
            </TableRowCell>
            {/*Protocol Fee*/}
            <TableRowCell>
                <Fee fee={fee} />
            </TableRowCell>
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
    settlementToken: { symbol: priceTokenSymbol, decimals: tokenDecimals },
    isLong,
    price,
    timeString,
    dateString,
    fee,
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
                <div>{tokenInAmount.toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    at {toApproxCurrency(price)} {priceTokenSymbol}/token
                </div>
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(price.times(tokenInAmount))}</TableRowCell>
            <TableRowCell>
                <Fee fee={fee} />
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

export const HistoricFlipCommitRow = ({
    txnHashIn,
    tokenOut: { amount: tokenOutAmount, symbol: tokenOutSymbol },
    tokenIn: { address: tokenInAddress, amount: tokenInAmount, symbol: tokenInSymbol },
    settlementToken: { symbol: priceTokenSymbol, decimals: tokenDecimals },
    price,
    timeString,
    dateString,
    fee,
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
                <div className="my-auto flex">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenInSymbol)} className="my-auto mr-2 inline" />
                    <div>
                        <div>{tokenInSymbol}</div>
                        <div className="text-cool-gray-500">{toApproxCurrency(price)}</div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>{tokenInAmount.toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    {toApproxCurrency(price.times(tokenInAmount))} {priceTokenSymbol}
                </div>
            </TableRowCell>
            <TableRowCell>
                <div className="my-auto flex">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenOutSymbol)} className="my-auto mr-2 inline" />
                    <div>
                        <div>{tokenOutSymbol}</div>
                        <div className="text-cool-gray-500">{toApproxCurrency(price)}</div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>{tokenOutAmount.toFixed(2)} tokens</div>
            </TableRowCell>
            <TableRowCell>
                <Fee fee={fee} />
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

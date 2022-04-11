import React from 'react';
import { ethers } from 'ethers';
import { CommitEnum, NETWORKS } from '@tracer-protocol/pools-js';
import { Logo, tokenSymbolToLogoTicker } from '~/components/General';
import { TableRow, TableRowCell } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { TradeHistory } from '~/types/commits';
import { formatBN, toApproxCurrency } from '~/utils/converters';
import { Fee } from './Fee';
import { Market } from '../Market';

type HistoricCommitProps = TradeHistory & {
    provider?: ethers.providers.JsonRpcProvider;
};

type RowProps = HistoricCommitProps & {
    timeString: string;
    dateString: string;
};

const HistoricMintCommitRow = ({
    transactionHashIn,
    tokenOut: { address: tokenOutAddress, symbol: tokenOutSymbol },
    tokenIn: { amount: tokenInAmount },
    settlementToken: { symbol: priceTokenSymbol, decimals: tokenDecimals },
    isLong,
    price,
    timeString,
    dateString,
    fee,
    provider,
    transactionHashOut,
}: RowProps) => {
    return (
        <TableRow key={`${transactionHashIn}`} lined>
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
                            target: transactionHashIn,
                            logo: NETWORKS.ARBITRUM,
                            text: 'View Commit on Arbiscan',
                        },
                        {
                            type: BlockExplorerAddressType.txn,
                            target: transactionHashOut,
                            logo: NETWORKS.ARBITRUM,
                            text: 'View Upkeep on Arbiscan',
                        },
                    ]}
                />
            </TableRowCell>
        </TableRow>
    );
};

const HistoricBurnCommitRow = ({
    transactionHashIn,
    tokenIn: { address: tokenInAddress, amount: tokenInAmount, symbol: tokenInSymbol },
    settlementToken: { symbol: priceTokenSymbol, decimals: tokenDecimals },
    isLong,
    price,
    timeString,
    dateString,
    fee,
    provider,
    transactionHashOut,
}: RowProps) => {
    return (
        <TableRow key={`${transactionHashIn}`} lined>
            <TableRowCell>
                <div>{timeString}</div>
                <div className="text-cool-gray-500">{dateString}</div>
            </TableRowCell>
            <TableRowCell>
                <Market tokenSymbol={tokenInSymbol} isLong={isLong} />
            </TableRowCell>
            <TableRowCell>
                <div>{formatBN(tokenInAmount, tokenDecimals).toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    at {toApproxCurrency(formatBN(price, tokenDecimals))} {priceTokenSymbol}/token
                </div>
            </TableRowCell>
            <TableRowCell>
                {toApproxCurrency(formatBN(price, tokenDecimals).times(formatBN(tokenInAmount, tokenDecimals)))}
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
                            target: transactionHashIn,
                            logo: NETWORKS.ARBITRUM,
                            text: 'View Commit on Arbiscan',
                        },
                        {
                            type: BlockExplorerAddressType.txn,
                            target: transactionHashOut,
                            logo: NETWORKS.ARBITRUM,
                            text: 'View Upkeep on Arbiscan',
                        },
                    ]}
                />
            </TableRowCell>
        </TableRow>
    );
};

const HistoricFlipCommitRow = ({
    transactionHashIn,
    tokenOut: { amount: tokenOutAmount, symbol: tokenOutSymbol },
    tokenIn: { address: tokenInAddress, amount: tokenInAmount, symbol: tokenInSymbol },
    settlementToken: { symbol: priceTokenSymbol, decimals: tokenDecimals },
    price,
    timeString,
    dateString,
    fee,
    provider,
    transactionHashOut,
}: RowProps) => {
    const formattedPrice = formatBN(price, tokenDecimals);
    return (
        <TableRow key={`${transactionHashIn}`} lined>
            <TableRowCell>
                <div>{timeString}</div>
                <div className="text-cool-gray-500">{dateString}</div>
            </TableRowCell>
            <TableRowCell>
                <div className="my-auto flex">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenInSymbol)} className="my-auto mr-2 inline" />
                    <div>
                        <div>{tokenInSymbol}</div>
                        <div className="text-cool-gray-500">{toApproxCurrency(formattedPrice)}</div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>{(tokenInAmount.toNumber() / 10 ** tokenDecimals).toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    {toApproxCurrency(formattedPrice.times(formatBN(tokenInAmount, tokenDecimals)))} {priceTokenSymbol}
                </div>
            </TableRowCell>
            <TableRowCell>
                <div className="my-auto flex">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenOutSymbol)} className="my-auto mr-2 inline" />
                    <div>
                        <div>{tokenOutSymbol}</div>
                        <div className="text-cool-gray-500">{toApproxCurrency(formattedPrice)}</div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>{formatBN(tokenOutAmount, tokenDecimals).toFixed(2)} tokens</div>
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
                            target: transactionHashIn,
                            logo: NETWORKS.ARBITRUM,
                            text: 'View Commit on Arbiscan',
                        },
                        {
                            type: BlockExplorerAddressType.txn,
                            target: transactionHashOut,
                            logo: NETWORKS.ARBITRUM,
                            text: 'View Upkeep on Arbiscan',
                        },
                    ]}
                />
            </TableRowCell>
        </TableRow>
    );
};

export const CommitRow = (props: HistoricCommitProps): JSX.Element => {
    const { commitType } = props;
    if (commitType === CommitEnum.longMint || commitType === CommitEnum.shortMint) {
        return <HistoricMintCommitRow {...props} />;
    } else if (commitType === CommitEnum.longBurn || commitType === CommitEnum.shortBurn) {
        return <HistoricBurnCommitRow {...props} />;
    } else if (commitType === CommitEnum.longBurnShortMint || commitType === CommitEnum.shortBurnLongMint) {
        return <HistoricFlipCommitRow {...props} />;
    }
    // default return nothing
    return <></>;
};

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { CommitEnum, CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { Logo, tokenSymbolToLogoTicker } from '~/components/General';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '~/components/General/TWTable';
import TimeLeft from '~/components/TimeLeft';
import Actions from '~/components/TokenActions';
import { CommitActionToQueryFocusMap } from '~/constants/commits';
import { useStore } from '~/store/main';
import { selectProvider } from '~/store/Web3Slice';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { QueuedCommit } from '~/types/pools';
import { marketSymbolToAssetName, toApproxCurrency } from '~/utils/converters';

import { NoQueuedCommits } from './NoQueuedCommits.index';
import { PageOptions } from '..';
import { Market } from '../Market';

const queuedOptions: (numMints: number, numBurns: number, numFlips: number) => PageOptions = (
    numMints,
    numBurns,
    numFlips,
) => {
    return [
        {
            key: CommitActionEnum.mint,
            text: <>Pending Mints ({numMints})</>,
        },
        {
            key: CommitActionEnum.burn,
            text: <>Pending Burns ({numBurns})</>,
        },
        {
            key: CommitActionEnum.flip,
            text: <>Pending Flips ({numFlips})</>,
        },
    ];
};

export default (({ focus, commits }) => {
    const router = useRouter();
    const provider = useStore(selectProvider);

    const { mintCommits, burnCommits, flipCommits } = useMemo(
        () => ({
            mintCommits: commits.filter(
                (commit) => commit.type === CommitEnum.longMint || commit.type === CommitEnum.shortMint,
            ),
            burnCommits: commits.filter(
                (commit) => commit.type === CommitEnum.longBurn || commit.type === CommitEnum.shortBurn,
            ),
            flipCommits: commits.filter(
                (commit) =>
                    commit.type === CommitEnum.longBurnShortMint || commit.type === CommitEnum.shortBurnLongMint,
            ),
        }),
        [commits],
    );

    const tableContent = (focus: CommitActionEnum) => {
        switch (focus) {
            case CommitActionEnum.mint:
                return (
                    <>
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>Token</TableHeaderCell>
                                <TableHeaderCell>Amount</TableHeaderCell>
                                <TableHeaderCell>Tokens / Price *</TableHeaderCell>
                                <TableHeaderCell>Mint In</TableHeaderCell>
                                <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {mintCommits.length === 0 ? (
                                <NoQueuedCommits focus={CommitActionEnum.mint} />
                            ) : (
                                mintCommits.map((commit) => (
                                    <MintCommitRow
                                        key={`${commit.pool}-${commit.id}`}
                                        provider={provider ?? null}
                                        {...commit}
                                    />
                                ))
                            )}
                        </tbody>
                    </>
                );
            case CommitActionEnum.burn:
                return (
                    <>
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>Token</TableHeaderCell>
                                <TableHeaderCell>Amount</TableHeaderCell>
                                <TableHeaderCell>Return / Price *</TableHeaderCell>
                                <TableHeaderCell>Burn In</TableHeaderCell>
                                <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {burnCommits.length === 0 ? (
                                <NoQueuedCommits focus={CommitActionEnum.burn} />
                            ) : (
                                burnCommits.map((commit) => (
                                    <BurnCommitRow
                                        key={`${commit.pool}-${commit.id}`}
                                        provider={provider ?? null}
                                        {...commit}
                                    />
                                ))
                            )}
                        </tbody>
                    </>
                );
            case CommitActionEnum.flip:
                return (
                    <>
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>From</TableHeaderCell>
                                <TableHeaderCell />
                                <TableHeaderCell>To</TableHeaderCell>
                                <TableHeaderCell />
                                <TableHeaderCell>Flip In</TableHeaderCell>
                                <TableHeaderCell />
                            </tr>
                            <tr>
                                <TableHeaderCell>Token / Price *</TableHeaderCell>
                                <TableHeaderCell>Amount *</TableHeaderCell>
                                <TableHeaderCell>Token / Price *</TableHeaderCell>
                                <TableHeaderCell>Amount *</TableHeaderCell>
                                <TableHeaderCell />
                                <TableHeaderCell />
                            </tr>
                        </TableHeader>
                        <tbody>
                            {flipCommits.length === 0 ? (
                                <NoQueuedCommits focus={CommitActionEnum.flip} />
                            ) : (
                                flipCommits.map((commit) => (
                                    <FlipCommitRow
                                        key={`${commit.pool}-${commit.id}`}
                                        provider={provider ?? null}
                                        {...commit}
                                    />
                                ))
                            )}
                        </tbody>
                    </>
                );
            default: // impossible unless more types are added to enum
                return <></>;
        }
    };

    return (
        <div className="my-5 rounded-xl bg-theme-background p-5 shadow">
            <div className="mb-5">
                <TWButtonGroup
                    value={focus}
                    size="lg"
                    onClick={(option) =>
                        router.push({
                            query: {
                                focus: CommitActionToQueryFocusMap[option as CommitActionEnum],
                            },
                        })
                    }
                    color="tracer"
                    options={queuedOptions(mintCommits.length, burnCommits.length, flipCommits.length)}
                />
            </div>
            <Table>{tableContent(focus)}</Table>
            <div className="flex">
                <div className="mt-8 max-w-2xl text-sm text-theme-text opacity-80">
                    * <strong>Token Price</strong> and{' '}
                    <strong>{focus === CommitActionEnum.mint ? 'Amount' : 'Return'}</strong> values are indicative only,
                    and represent the estimated values for the next rebalance, given the committed mints and burns and
                    change in price of the underlying asset.
                </div>
            </div>
        </div>
    );
}) as React.FC<{
    focus: CommitActionEnum;
    commits: QueuedCommit[];
}>;

const MintCommitRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
    }
> = ({ tokenOut, txnHash, tokenPrice, amount, provider, settlementTokenSymbol, expectedExecution }) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <Market tokenSymbol={tokenOut.symbol} isLong={tokenOut.side === SideEnum.long} />
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(amount)}</TableRowCell>
            <TableRowCell>
                <div>{amount.div(tokenPrice).toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    at {toApproxCurrency(tokenPrice)} {settlementTokenSymbol}/token
                </div>
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

const BurnCommitRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
    }
> = ({ tokenOut, txnHash, tokenPrice, amount, provider, settlementTokenSymbol, expectedExecution }) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <div className="my-auto flex">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenOut.symbol)} className="my-auto mr-2 inline" />
                    <div>
                        <div className="flex">
                            <div>
                                {}
                                {tokenOut.symbol.split('-')[0][0]}-
                                {
                                    marketSymbolToAssetName[
                                        `${tokenOut.symbol.split('-')[1].split('/')[0]}/${
                                            tokenOut.symbol.split('-')[1].split('/')[1]
                                        }`
                                    ]
                                }
                            </div>
                            &nbsp;
                            <div className={`${tokenOut.side === SideEnum.long ? 'green' : 'red'}`}>
                                {tokenOut.side === SideEnum.long ? 'Long' : 'Short'}
                            </div>
                        </div>
                        <div className="text-cool-gray-500">{tokenOut.symbol} </div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>{amount.toFixed(2)} tokens</TableRowCell>
            <TableRowCell>
                <div>
                    {toApproxCurrency(tokenPrice.times(amount))} {tokenOut.symbol.split('-')[1].split('/')[1]}
                </div>
                <div>
                    at {toApproxCurrency(tokenPrice)} {settlementTokenSymbol}/token
                </div>
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

const FlipCommitRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
    }
> = ({ tokenIn, tokenOut, txnHash, tokenPrice, amount, provider, settlementTokenSymbol, expectedExecution }) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <div className="my-auto flex">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenOut.symbol)} className="my-auto mr-2 inline" />
                    <div>
                        <div>{tokenOut.symbol}</div>
                        <div className="text-cool-gray-500">{toApproxCurrency(tokenPrice)}</div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>{amount.toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    {toApproxCurrency(tokenPrice.times(amount))} {settlementTokenSymbol}
                </div>
            </TableRowCell>
            <TableRowCell>
                <div className="my-auto flex">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenIn.symbol)} className="my-auto mr-2 inline" />
                    <div>
                        <div>{tokenIn.symbol}</div>
                        <div className="text-cool-gray-500">{toApproxCurrency(tokenPrice)}</div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>{amount.toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    {toApproxCurrency(tokenPrice.times(amount))} {settlementTokenSymbol}
                </div>
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

interface ReceiveInProps {
    pendingUpkeep: boolean;
    setPendingUpkeep: React.Dispatch<React.SetStateAction<boolean>>;
    actionType: CommitActionEnum;
    expectedExecution: number;
}
const ReceiveIn: React.FC<ReceiveInProps> = ({
    pendingUpkeep,
    setPendingUpkeep,
    actionType,
    expectedExecution,
}: ReceiveInProps) => {
    if (pendingUpkeep) {
        return <>{`${actionType === CommitActionEnum.mint ? 'Mint' : 'Burn'} in progress`}</>;
    } else {
        return (
            <TimeLeft
                targetTime={expectedExecution}
                countdownEnded={() => {
                    setPendingUpkeep(true);
                }}
            />
        );
    }
};

import React, { useMemo, useState } from 'react';
import { CommitActionEnum, SideEnum } from '@libs/constants';
import { CommitEnum } from '@tracer-protocol/pools-js';
import { CommitActionToQueryFocusMap } from '@libs/constants';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '@components/General/TWTable';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { useRouter } from 'next/router';
import { QueuedCommit } from '@libs/types/General';
import { ethers } from 'ethers';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { marketSymbolToAssetName, toApproxCurrency } from '@libs/utils/converters';
import Actions from '@components/TokenActions';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import BigNumber from 'bignumber.js';
import TimeLeft from '@components/TimeLeft';

import NoQueued from '@public/img/no-queued.svg';
import { PageOptions } from '..';

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
    const { provider } = useWeb3();

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

    const MintRows = (mintCommits: QueuedCommit[]) => {
        if (mintCommits.length === 0) {
            return (
                <tr>
                    <td colSpan={4}>
                        <div className="my-20 text-center">
                            <NoQueued className="mx-auto mb-5" />
                            <div className="text-cool-gray-500">You have no pending mints.</div>
                        </div>
                    </td>
                </tr>
            );
        } else {
            return mintCommits.map((commit) => (
                <MintCommitRow key={`${commit.pool}-${commit.id}`} provider={provider ?? null} {...commit} />
            ));
        }
    };

    const BurnRows = (burnCommits: QueuedCommit[]) => {
        if (burnCommits.length === 0) {
            return (
                <tr>
                    <td colSpan={4}>
                        <div className="my-20 text-center">
                            <NoQueued className="mx-auto mb-5" />
                            <div className="text-cool-gray-500">You have no pending burns.</div>
                        </div>
                    </td>
                </tr>
            );
        } else {
            return burnCommits.map((commit) => (
                <BurnCommitRow key={`${commit.pool}-${commit.id}`} provider={provider ?? null} {...commit} />
            ));
        }
    };

    const FlipRows = (flipCommits: QueuedCommit[]) => {
        if (burnCommits.length === 0) {
            return (
                <tr>
                    <td colSpan={5}>
                        <div className="my-20 text-center">
                            <NoQueued className="mx-auto mb-5" />
                            <div className="text-cool-gray-500">You have no pending flips.</div>
                        </div>
                    </td>
                </tr>
            );
        } else {
            return flipCommits.map((commit) => (
                <FlipCommitRow key={`${commit.pool}-${commit.id}`} provider={provider ?? null} {...commit} />
            ));
        }
    };

    const TableContent = (focus: CommitActionEnum) => {
        if (focus === CommitActionEnum.mint) {
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
                    <tbody>{MintRows(mintCommits)}</tbody>
                </>
            );
        } else if (focus === CommitActionEnum.burn) {
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
                    <tbody>{BurnRows(burnCommits)}</tbody>
                </>
            );
        } else if (focus === CommitActionEnum.flip) {
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
                    <tbody>{FlipRows(flipCommits)}</tbody>
                </>
            );
        }
    };

    return (
        <div className="bg-theme-background rounded-xl shadow my-5 p-5">
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
            <Table>{TableContent(focus)}</Table>
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
> = ({
    tokenOut,
    txnHash,
    tokenPrice,
    amount,
    nextRebalance,
    provider,
    frontRunningInterval,
    updateInterval,
    created,
    quoteTokenSymbol,
}) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <div className="flex my-auto">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenOut.symbol)} className="inline my-auto mr-2" />
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
                <div className="text-cool-gray-500">
                    at {toApproxCurrency(tokenPrice)} {quoteTokenSymbol}/token
                </div>
            </TableRowCell>
            <TableRowCell>
                <ReceiveIn
                    pendingUpkeep={pendingUpkeep}
                    setPendingUpkeep={setPendingUpkeep}
                    actionType={CommitActionEnum.mint}
                    nextRebalance={nextRebalance}
                    created={created}
                    frontRunningInterval={frontRunningInterval}
                    updateInterval={updateInterval}
                />
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={tokenOut}
                    provider={provider}
                    arbiscanTarget={{
                        type: ArbiscanEnum.txn,
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
> = ({
    tokenOut,
    txnHash,
    tokenPrice,
    amount,
    nextRebalance,
    provider,
    frontRunningInterval,
    updateInterval,
    created,
    quoteTokenSymbol,
}) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <div className="flex my-auto">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenOut.symbol)} className="inline my-auto mr-2" />
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
                    at {toApproxCurrency(tokenPrice)} {quoteTokenSymbol}/token
                </div>
            </TableRowCell>
            <TableRowCell>
                <ReceiveIn
                    pendingUpkeep={pendingUpkeep}
                    setPendingUpkeep={setPendingUpkeep}
                    actionType={CommitActionEnum.mint}
                    nextRebalance={nextRebalance}
                    created={created}
                    frontRunningInterval={frontRunningInterval}
                    updateInterval={updateInterval}
                />
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={tokenOut}
                    provider={provider}
                    arbiscanTarget={{
                        type: ArbiscanEnum.txn,
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
> = ({
    tokenIn,
    tokenOut,
    txnHash,
    tokenPrice,
    amount,
    nextRebalance,
    provider,
    frontRunningInterval,
    updateInterval,
    created,
    quoteTokenSymbol,
}) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} lined>
            <TableRowCell>
                <div className="flex my-auto">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenOut.symbol)} className="inline my-auto mr-2" />
                    <div>
                        <div>{tokenOut.symbol}</div>
                        <div className="text-cool-gray-500">{toApproxCurrency(tokenPrice)}</div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>{amount.toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    {toApproxCurrency(tokenPrice.times(amount))} {quoteTokenSymbol}
                </div>
            </TableRowCell>
            <TableRowCell>
                <div className="flex my-auto">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenIn.symbol)} className="inline my-auto mr-2" />
                    <div>
                        <div>{tokenIn.symbol}</div>
                        <div className="text-cool-gray-500">{toApproxCurrency(tokenPrice)}</div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>{amount.toFixed(2)} tokens</div>
                <div className="text-cool-gray-500">
                    {toApproxCurrency(tokenPrice.times(amount))} {quoteTokenSymbol}
                </div>
            </TableRowCell>
            <TableRowCell>
                <ReceiveIn
                    pendingUpkeep={pendingUpkeep}
                    setPendingUpkeep={setPendingUpkeep}
                    actionType={CommitActionEnum.mint}
                    nextRebalance={nextRebalance}
                    created={created}
                    frontRunningInterval={frontRunningInterval}
                    updateInterval={updateInterval}
                />
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={tokenOut}
                    provider={provider}
                    arbiscanTarget={{
                        type: ArbiscanEnum.txn,
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
    nextRebalance: BigNumber;
    created: number;
    frontRunningInterval: BigNumber;
    updateInterval: BigNumber;
}
const ReceiveIn: React.FC<ReceiveInProps> = ({
    pendingUpkeep,
    setPendingUpkeep,
    actionType,
    nextRebalance,
    created,
    frontRunningInterval,
    updateInterval,
}: ReceiveInProps) => {
    if (pendingUpkeep) {
        return <>{`${actionType === CommitActionEnum.mint ? 'Mint' : 'Burn'} in progress`}</>;
    } else {
        if (nextRebalance.toNumber() - created < frontRunningInterval.toNumber()) {
            return (
                <TimeLeft
                    targetTime={nextRebalance.toNumber() + updateInterval.toNumber()}
                    countdownEnded={() => {
                        setPendingUpkeep(true);
                    }}
                />
            );
        } else {
            return (
                <TimeLeft
                    targetTime={nextRebalance.toNumber()}
                    countdownEnded={() => {
                        setPendingUpkeep(true);
                    }}
                />
            );
        }
    }
};

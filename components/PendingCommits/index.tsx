import React, { useState } from 'react';
import { QueuedCommit } from '@libs/types/General';
import usePendingCommits from '@libs/hooks/useQueuedCommits';
import { toApproxCurrency } from '@libs/utils/converters';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions, useCommits } from '@context/UsersCommitContext';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import { TWModal } from '@components/General/TWModal';
import { CommitActionEnum } from '@libs/constants';
import { CommitEnum } from '@tracer-protocol/pools-js';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '@components/General/TWTable';
import Actions from '@components/TokenActions';
import Close from '/public/img/general/close.svg';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import BigNumber from 'bignumber.js';

export default (() => {
    const { provider } = useWeb3();
    const { showCommits = false, focus = CommitActionEnum.mint } = useCommits();
    const { commitDispatch = () => console.error('Dispatch undefined') } = useCommitActions();
    const commits = usePendingCommits();

    const mintCommits = commits.filter(
        (commit) => commit.type === CommitEnum.longMint || commit.type === CommitEnum.shortMint,
    );

    const burnCommits = commits.filter(
        (commit) => commit.type === CommitEnum.longBurn || commit.type === CommitEnum.shortBurn,
    );

    return (
        <TWModal size={'wide'} open={showCommits} onClose={() => commitDispatch({ type: 'hide' })}>
            <div className="flex justify-between">
                <h1 className="text-bold text-2xl text-theme-text">
                    {`Queued ${focus === CommitActionEnum.mint ? 'Mints' : 'Burns'}`}
                </h1>
                <div className="w-3 h-3 cursor-pointer" onClick={() => commitDispatch({ type: 'hide' })}>
                    <Close />
                </div>
            </div>
            <Table>
                {focus === CommitActionEnum.mint ? (
                    <>
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>Token</TableHeaderCell>
                                <TableHeaderCell>Spent (USD)</TableHeaderCell>
                                <TableHeaderCell>Token Price (USD) *</TableHeaderCell>
                                <TableHeaderCell>Amount (Tokens) *</TableHeaderCell>
                                <TableHeaderCell>Receive in</TableHeaderCell>
                                <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                            </tr>
                        </TableHeader>
                        {mintCommits.map((commit, index) => (
                            <CommitRow key={`pcr-${index}`} provider={provider ?? null} {...commit} burnRow={false} />
                        ))}
                    </>
                ) : (
                    <>
                        <TableHeader>
                            <tr>
                                <TableHeaderCell>Token</TableHeaderCell>
                                <TableHeaderCell>Sold (Tokens)</TableHeaderCell>
                                <TableHeaderCell>Token Price (USD) *</TableHeaderCell>
                                <TableHeaderCell>Return (USD) *</TableHeaderCell>
                                <TableHeaderCell>Burn in</TableHeaderCell>
                                <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                            </tr>
                        </TableHeader>
                        {burnCommits.map((commit, index) => (
                            <CommitRow key={`pcr-${index}`} provider={provider ?? null} {...commit} burnRow={true} />
                        ))}
                    </>
                )}
            </Table>
            <div className="absolute bottom-10 left-0 right-0 mx-auto max-w-2xl text-sm text-theme-text opacity-80 text-center">
                * <strong>Token Price</strong> and{' '}
                <strong>{focus === CommitActionEnum.mint ? 'Amount' : 'Return'}</strong> values are indicative only, and
                represent the estimated values for the next rebalance, given the committed mints and burns and change in
                price of the underlying asset.
            </div>
        </TWModal>
    );
}) as React.FC;

export const CommitRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
        burnRow: boolean; // is burnRow
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
    burnRow,
}) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash}>
            <TableRowCell>
                <Logo ticker={tokenSymbolToLogoTicker(tokenOut.symbol)} className="inline mr-2" />
                {tokenOut.name}
            </TableRowCell>
            {burnRow ? (
                <>
                    <TableRowCell>{amount.toFixed(2)}</TableRowCell>
                    <TableRowCell>{toApproxCurrency(tokenPrice)}</TableRowCell>
                    <TableRowCell>{toApproxCurrency(amount.times(tokenPrice))}</TableRowCell>
                </>
            ) : (
                <>
                    <TableRowCell>{toApproxCurrency(amount)}</TableRowCell>
                    <TableRowCell>{toApproxCurrency(tokenPrice)}</TableRowCell>
                    <TableRowCell>{amount.div(tokenPrice).toFixed(3)}</TableRowCell>
                </>
            )}
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

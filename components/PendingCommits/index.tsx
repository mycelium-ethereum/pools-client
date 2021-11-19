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
import { CommitActionEnum, CommitsFocusEnum } from '@libs/constants';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '@components/General/TWTable';
import Actions from '@components/TokenActions';
import Close from '/public/img/general/close.svg';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import BigNumber from 'bignumber.js';
import { CommitEnum } from '@tracer-protocol/pools-js/types/enums';

export default (() => {
    const { provider } = useWeb3();
    const { showCommits = false, focus = CommitsFocusEnum.mints } = useCommits();
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
                    {`Queued ${focus === CommitsFocusEnum.mints ? 'Mints' : 'Burns'}`}
                </h1>
                <div className="w-3 h-3 cursor-pointer" onClick={() => commitDispatch({ type: 'hide' })}>
                    <Close />
                </div>
            </div>
            <Table>
                {focus === CommitsFocusEnum.mints ? (
                    <>
                        <TableHeader>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Spent (USDC)</TableHeaderCell>
                            <TableHeaderCell>Token Price (USDC) *</TableHeaderCell>
                            <TableHeaderCell>Amount (Tokens) *</TableHeaderCell>
                            <TableHeaderCell>Receive in</TableHeaderCell>
                            <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                        </TableHeader>
                        {mintCommits.map((commit, index) => (
                            <MintRow key={`pcr-${index}`} index={index} provider={provider ?? null} {...commit} />
                        ))}
                    </>
                ) : (
                    <>
                        <TableHeader>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Sold (Tokens)</TableHeaderCell>
                            <TableHeaderCell>Token Price (USDC) *</TableHeaderCell>
                            <TableHeaderCell>Return (USDC) *</TableHeaderCell>
                            <TableHeaderCell>Burn in</TableHeaderCell>
                            <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                        </TableHeader>
                        {burnCommits.map((commit, index) => (
                            <BurnRow key={`pcr-${index}`} index={index} provider={provider ?? null} {...commit} />
                        ))}
                    </>
                )}
            </Table>
            <div className="absolute bottom-10 left-0 right-0 mx-auto max-w-2xl text-sm text-theme-text opacity-80 text-center">
                * <strong>Token Price</strong> and{' '}
                <strong>{focus === CommitsFocusEnum.mints ? 'Amount' : 'Return'}</strong> values are indicative only,
                and represent the estimated values for the next rebalance, given the committed mints and burns and
                change in price of the underlying asset.
            </div>
        </TWModal>
    );
}) as React.FC;

const MintRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
        index: number;
    }
> = ({
    token,
    txnHash,
    tokenPrice,
    amount,
    nextRebalance,
    provider,
    index,
    frontRunningInterval,
    updateInterval,
    created,
}) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} rowNumber={index}>
            <TableRowCell>
                <Logo ticker={tokenSymbolToLogoTicker(token.symbol)} className="inline mr-2" />
                {token.name}
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(amount)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(tokenPrice)}</TableRowCell>
            <TableRowCell>{amount.div(tokenPrice).toFixed(3)}</TableRowCell>
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
                    token={token}
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

const BurnRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
        index: number;
    }
> = ({
    token,
    txnHash,
    tokenPrice,
    amount,
    nextRebalance,
    provider,
    index,
    frontRunningInterval,
    updateInterval,
    created,
}) => {
    const [pendingUpkeep, setPendingUpkeep] = useState(false);

    return (
        <TableRow key={txnHash} rowNumber={index}>
            <TableRowCell>
                <Logo ticker={tokenSymbolToLogoTicker(token.symbol)} className="inline mr-2" />
                {token.name}
            </TableRowCell>
            <TableRowCell>{amount.toFixed(2)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(tokenPrice)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(amount.times(tokenPrice))}</TableRowCell>
            <TableRowCell>
                <ReceiveIn
                    pendingUpkeep={pendingUpkeep}
                    setPendingUpkeep={setPendingUpkeep}
                    actionType={CommitActionEnum.burn}
                    nextRebalance={nextRebalance}
                    created={created}
                    frontRunningInterval={frontRunningInterval}
                    updateInterval={updateInterval}
                />
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={token}
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

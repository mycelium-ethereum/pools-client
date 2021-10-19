import React from 'react';
import { QueuedCommit } from '@libs/types/General';
import usePendingCommits from '@libs/hooks/useQueuedCommits';
import { toApproxCurrency } from '@libs/utils/converters';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions, useCommits } from '@context/UsersCommitContext';
import { Logo } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import { TWModal } from '@components/General/TWModal';
import { CommitsFocusEnum, CommitEnum } from '@libs/constants';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '@components/General/TWTable';
import { tokenSymbolToLogoTicker } from '@components/General';
import Actions from '@components/TokenActions';
import Close from '/public/img/general/close.svg';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';

// import BigNumber from 'bignumber.js';
// const testCommits:QueuedCommit[] = [
//     {
//         pool: '',
//         id: 0,
//         type: 0,
//         amount: new BigNumber (5),
//         txnHash: '',
//         token: {
//             side: 0,
//             supply: new BigNumber(5),
//             address: '',
//             name: '',
//             symbol: 'test',
//             balance: new BigNumber(5),
//             approved: new BigNumber(6),
//         },
//         tokenPrice: new BigNumber(30),
//         nextRebalance: new BigNumber(1),
//         frontRunningInterval: new BigNumber(10),
//         updateInterval: new BigNumber(20)
//     }
// ]

export default (() => {
    const { provider } = useWeb3();
    const { showCommits = false, focus = CommitsFocusEnum.mints } = useCommits();
    const { commitDispatch = () => console.error('Dispatch undefined') } = useCommitActions();
    const commits = usePendingCommits(focus);

    const mintCommits = commits.filter(
        (commit) => commit.type === CommitEnum.long_mint || commit.type === CommitEnum.short_mint,
    );

    const burnCommits = commits.filter(
        (commit) => commit.type === CommitEnum.long_burn || commit.type === CommitEnum.short_burn,
    );

    return (
        <TWModal size={'wide'} open={showCommits} onClose={() => commitDispatch({ type: 'hide' })}>
            <div className="flex justify-between">
                <h1 className="text-bold font-size[30px] text-theme-text">
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
                            <TableHeaderCell>Spent (USDC) *</TableHeaderCell>
                            <TableHeaderCell>Token Price (USDC) *</TableHeaderCell>
                            <TableHeaderCell>Amount (Tokens)</TableHeaderCell>
                            <TableHeaderCell>Receive in</TableHeaderCell>
                            <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                        </TableHeader>
                        {mintCommits.map((commit, index) => (
                            <BuyRow key={`pcr-${index}`} index={index} provider={provider ?? null} {...commit} />
                        ))}
                    </>
                ) : (
                    <>
                        <TableHeader>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Sold (Tokens)</TableHeaderCell>
                            <TableHeaderCell>Price* (Token)</TableHeaderCell>
                            <TableHeaderCell>Return (USDC)</TableHeaderCell>
                            <TableHeaderCell>Burn in</TableHeaderCell>
                            <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                        </TableHeader>
                        {burnCommits.map((commit, index) => (
                            <SellRow key={`pcr-${index}`} index={index} provider={provider ?? null} {...commit} />
                        ))}
                    </>
                )}
            </Table>
        </TWModal>
    );
}) as React.FC;

const BuyRow: React.FC<
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
    return (
        <TableRow key={txnHash} rowNumber={index}>
            <TableRowCell>
                <Logo ticker={tokenSymbolToLogoTicker(token.symbol)} className="inline mr-2" />
                {token.name}
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(amount)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(tokenPrice)}</TableRowCell>
            <TableRowCell>{amount.div(tokenPrice).toFixed()}</TableRowCell>
            <TableRowCell>
                {nextRebalance.toNumber() - created < frontRunningInterval.toNumber() ? (
                    <TimeLeft targetTime={nextRebalance.toNumber() + updateInterval.toNumber()} />
                ) : (
                    <TimeLeft targetTime={nextRebalance.toNumber()} />
                )}
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

const SellRow: React.FC<
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
                {nextRebalance.toNumber() - created < frontRunningInterval.toNumber() ? (
                    <TimeLeft targetTime={nextRebalance.toNumber() + updateInterval.toNumber()} />
                ) : (
                    <TimeLeft targetTime={nextRebalance.toNumber()} />
                )}
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

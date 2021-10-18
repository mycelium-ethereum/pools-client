import React from 'react';
import { ClaimablePool, QueuedCommit } from '@libs/types/General';
import usePendingCommits from '@libs/hooks/useQueuedCommits';
import { toApproxCurrency } from '@libs/utils/converters';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions, useCommits } from '@context/UsersCommitContext';
import { Logo, LogoTicker } from '@components/General';
import { TWModal } from '@components/General/TWModal';
import { CommitsFocusEnum } from '@libs/constants';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '@components/General/TWTable';
import { tokenSymbolToLogoTicker } from '@components/General';
import Actions from '@components/TokenActions';
import Close from '/public/img/general/close.svg';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { ethers } from 'ethers';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import Button from '@components/General/Button';
import { usePoolActions } from '@context/PoolContext';

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
    const { showCommits = true, focus = CommitsFocusEnum.pending } = useCommits();
    const { commitDispatch = () => console.error('Dispatch undefined') } = useCommitActions();
    const { pendingCommits, claimablePools } = usePendingCommits();

    return (
        <TWModal size={'wide'} open={showCommits} onClose={() => commitDispatch({ type: 'hide' })}>
            <div className="flex justify-between">
                <h1 className="text-bold font-size[30px] text-theme-text">
                    {`${focus === CommitsFocusEnum.pending ? 'Pending' : 'Claimable'} commits`}
                </h1>
                <div className="w-3 h-3 cursor-pointer" onClick={() => commitDispatch({ type: 'hide' })}>
                    <Close />
                </div>
            </div>
            <div className="flex">
                <TWButtonGroup
                    value={focus}
                    size={'xl'}
                    color={'tracer'}
                    onClick={(val) => {
                        commitDispatch({ type: 'setFocus', focus: val as CommitsFocusEnum });
                    }}
                    options={[
                        {
                            key: 0,
                            text: 'Pending',
                        },
                        {
                            key: 1,
                            text: 'Claimable',
                        },
                    ]}
                />
            </div>
            {focus === CommitsFocusEnum.pending ? (
                <div>
                    <h2 className="mt-3">Pending Mints</h2>
                    <Table>
                        <TableHeader>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Spend (USDC)</TableHeaderCell>
                            <TableHeaderCell>Token Price (USDC)</TableHeaderCell>
                            <TableHeaderCell>Amount (Tokens)</TableHeaderCell>
                            <TableHeaderCell>Receive in</TableHeaderCell>
                            <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                        </TableHeader>
                        {pendingCommits.mints.map((commit, index) => (
                            <MintRow key={`pending-mint-${index}`} index={index} provider={provider ?? null} {...commit} />
                        ))}
                    </Table>
                    <h2 className="mt-3">Pending Burns</h2>
                    <Table>
                        <TableHeader>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Amount (Tokens)</TableHeaderCell>
                            <TableHeaderCell>Token Price (USDC)</TableHeaderCell>
                            <TableHeaderCell>Expected Return (USDC)</TableHeaderCell>
                            <TableHeaderCell>Receive in</TableHeaderCell>
                            <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                        </TableHeader>
                        {pendingCommits.burns.map((commit, index) => (
                            <BurnRow key={`pending-burn-${index}`} index={index} provider={provider ?? null} {...commit} />
                        ))}
                    </Table>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableHeaderCell>Pool</TableHeaderCell>
                        <TableHeaderCell>Claimable (USDC)</TableHeaderCell>
                        <TableHeaderCell>Claimable Long / Token Price (USDC)</TableHeaderCell>
                        <TableHeaderCell>Claimable Short / Token Price (USDC)</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </TableHeader>
                    {claimablePools.map((pool, index) => (
                        <ClaimablePoolRow
                            key={`claimable-pool-${pool.pool}`}
                            index={index}
                            provider={provider ?? null}
                            {...pool}
                        />
                    ))}
                </Table>
            )}
        </TWModal>
    );
}) as React.FC;


const MintRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
        index: number;
    }
> = ({ token, commitmentTime, tokenPrice, amount, provider, index }) => {
    return (
        <TableRow key={`commit-row-${index}`} rowNumber={index}>
            <TableRowCell>
                <Logo ticker={tokenSymbolToLogoTicker(token.symbol)} className="inline mr-2" />
                {token.name}
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(amount)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(tokenPrice)}</TableRowCell>
            <TableRowCell>{amount.div(tokenPrice).toFixed()}</TableRowCell>
            <TableRowCell>
                <TimeLeft targetTime={commitmentTime.toNumber()} />
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={token}
                    provider={provider}
                    arbiscanTarget={{
                        type: ArbiscanEnum.txn,
                        target: '',
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
> = ({ token, commitmentTime, tokenPrice, amount, provider, index }) => {
    return (
        <TableRow key={`commit-row-${index}`} rowNumber={index}>
            <TableRowCell>
                <Logo ticker={tokenSymbolToLogoTicker(token.symbol)} className="inline mr-2" />
                {token.name}
            </TableRowCell>
            <TableRowCell>{amount.toFixed(2)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(tokenPrice)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(amount.times(tokenPrice))}</TableRowCell>
            <TableRowCell>
                <TimeLeft targetTime={commitmentTime.toNumber()} />
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={token}
                    provider={provider}
                    arbiscanTarget={{
                        type: ArbiscanEnum.txn,
                        target: '',
                    }}
                />
            </TableRowCell>
        </TableRow>
    );
};

const ClaimablePoolRow: React.FC<
    ClaimablePool & {
        provider: ethers.providers.JsonRpcProvider | null;
        index: number;
    }
> = ({
    // provider,
    index,
    pool: { name, address },
    claimableLongTokens,
    claimableShortTokens,
    longTokenPrice,
    shortTokenPrice,
    claimableSettlementTokens,
}) => {
    const { claim = () => console.error("Claim is undefined") } = usePoolActions();
    return (
        <TableRow rowNumber={index}>
            <TableRowCell>
                <Logo ticker={name.split('/')[0] as LogoTicker} className="inline mr-2" />
                {name}
            </TableRowCell>
            <TableRowCell>{toApproxCurrency(claimableSettlementTokens)}</TableRowCell>
            <TableRowCell>
                {claimableLongTokens.toFixed(2)} / {toApproxCurrency(longTokenPrice)}
            </TableRowCell>
            <TableRowCell>
                {claimableShortTokens.toFixed(2)} / {toApproxCurrency(shortTokenPrice)}
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Button variant="primary-light" size={"sm"} className="rounded-2xl" onClick={() => claim(address)} >Claim</Button>
            </TableRowCell>
        </TableRow>
    );
};

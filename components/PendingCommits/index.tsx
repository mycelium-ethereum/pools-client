import React, { Fragment } from 'react';
import styled from 'styled-components';
// import { Table, TableBody, span, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { PoolToken, QueuedCommit } from '@libs/types/General';
import usePendingCommits from '@libs/hooks/useQueuedCommits';
import { toApproxCurrency } from '@libs/utils/converters';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions, useCommits } from '@context/UsersCommitContext';
import { usePoolActions } from '@context/PoolContext';
import { Logo } from '@components/General';
import Button from '@components/General/Button';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import { openEtherscan, watchAsset } from '@libs/utils/rpcMethods';
import Modal, { ModalInner } from '@components/General/Modal';
import { Popover, Transition } from '@headlessui/react';
import { CommitsFocusEnum } from '@libs/constants';

import { Table, TableHeader, TableRow } from '@components/General/TWTable';

// import BigNumber from 'bignumber.js';
// const testCommits = [
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
//             approved: true,
//         },
//         tokenPrice: new BigNumber(30),
//         nextRebalance: new BigNumber(1),
//     }
// ]

// TODO filter buys and sells
export default (() => {
    const { provider } = useWeb3();
    const { showCommits = false, focus = CommitsFocusEnum.buys } = useCommits();
    const { commitDispatch = () => console.error('Dispatch undefined') } = useCommitActions();
    const { uncommit = () => console.error('uncommit undefined') } = usePoolActions();
    const commits = usePendingCommits(focus);

    return (
        <PendingCommitsModal show={showCommits} onClose={() => commitDispatch({ type: 'hide' })}>
            <h1 className="text-bold font-size[30px] text-cool-gray-900">
                {`Queued ${focus === CommitsFocusEnum.buys ? 'Buys' : 'Sells'}`}
            </h1>
            <Table>
                {focus === CommitsFocusEnum.buys ? (
                    <>
                        <TableHeader>
                            <span>Token</span>
                            <span>Spend (USDC)</span>
                            <span>Token Price (USDC)</span>
                            <span>Amount (Tokens)</span>
                            <span>Next Rebalance</span>
                            <span>{/* Empty header for buttons column */}</span>
                        </TableHeader>
                        {commits.map((commit, index) => (
                            <BuyRow
                                key={`pcr-${index}`}
                                index={index}
                                provider={provider ?? null}
                                uncommit={uncommit}
                                {...commit}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        <TableHeader>
                            <span>Token</span>
                            <span>Sold (USDC)</span>
                            <span>Price* (Token)</span>
                            <span>Return (USDC)</span>
                            <span>Next Rebalance</span>
                            <span>{/* Empty header for buttons column */}</span>
                        </TableHeader>
                        {commits.map((commit, index) => (
                            <SellRow
                                key={`pcr-${index}`}
                                index={index}
                                provider={provider ?? null}
                                uncommit={uncommit}
                                {...commit}
                            />
                        ))}
                    </>
                )}
            </Table>
        </PendingCommitsModal>
    );
}) as React.FC;

const PendingCommitsModal = styled(Modal)`
    ${ModalInner} {
        max-width: 1010px;
        height: 700px;
    }
`;

const BuyRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
        uncommit: (pool: string, commitID: number) => void;
        index: number;
    }
> = ({ token, pool, id, txnHash, tokenPrice, amount, nextRebalance, provider, uncommit, index }) => {
    return (
        <TableRow key={txnHash} rowNumber={index}>
            <span>{token.name}</span>
            <span>{toApproxCurrency(amount)}</span>
            <span>{toApproxCurrency(tokenPrice)}</span>
            <span>{amount.toNumber()}</span>
            <span>
                <TimeLeft targetTime={nextRebalance.toNumber()} />
            </span>
            <span className="flex text-right">
                <Actions token={token} uncommit={uncommit} pool={pool} provider={provider} id={id} txnHash={txnHash} />
            </span>
        </TableRow>
    );
};

const SellRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
        uncommit: (pool: string, commitID: number) => void;
        index: number;
    }
> = ({ token, pool, id, txnHash, tokenPrice, amount, nextRebalance, provider, uncommit, index }) => {
    return (
        <TableRow key={txnHash} rowNumber={index}>
            <span>{token.name}</span>
            <span>{amount.toFixed(2)}</span>
            <span>{toApproxCurrency(tokenPrice)}</span>
            <span>{toApproxCurrency(amount.times(tokenPrice))}</span>
            <span>
                <TimeLeft targetTime={nextRebalance.toNumber()} />
            </span>
            <span className="flex text-right">
                <Actions token={token} uncommit={uncommit} pool={pool} provider={provider} id={id} txnHash={txnHash} />
            </span>
        </TableRow>
    );
};

const Actions: React.FC<{
    pool: string;
    uncommit: (pool: string, commitID: number) => void;
    id: number;
    provider: ethers.providers.JsonRpcProvider | null;
    token: PoolToken;
    txnHash: string;
}> = ({ uncommit, pool, id, provider, token, txnHash }) => (
    <>
        <Button
            size="xs"
            variant="primary-light"
            className="inline rounded-xl my-auto w-[65px] border border-tracer-500 focus:border-solid"
            onClick={() => uncommit(pool, id)}
        >
            Cancel
        </Button>
        <Popover as="div" className="inline relative ml-2 my-auto">
            {({ open }) => (
                <>
                    {/* Button */}
                    <Popover.Button className={'focus:border-none focus:outline-none mb-2'}>
                        <MoreOutlined
                            className="transition"
                            style={{
                                transform: open ? 'rotate(-90deg)' : '',
                            }}
                        />
                    </Popover.Button>

                    {/* Menu */}
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Popover.Panel className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200">
                            <div>
                                <div
                                    className="flex cursor-pointer text-sm items-center p-2 hover:bg-tracer-50"
                                    onClick={() => watchAsset(provider, token)}
                                >
                                    <PlusOutlined className="relative inline mr-2 h-[12px]" />
                                    Add token to wallet
                                </div>
                                <div
                                    className="flex cursor-pointer text-sm items-center p-2 hover:bg-tracer-50"
                                    onClick={() => openEtherscan(txnHash)}
                                >
                                    <Logo className="relative inline mr-2 w-[18px]" ticker={'ETHERSCAN'} />
                                    View on Etherscan
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    </>
);

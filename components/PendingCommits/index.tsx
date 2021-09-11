import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Table, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { Heading, QueuedCommit } from '@libs/types/General';
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
//         spent: new BigNumber(5),
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
            <Title>Queued {focus === CommitsFocusEnum.buys ? 'Buys' : 'Sells'}</Title>
            <Table>
                <TableHeader>
                    {headings.map((heading, index) => (
                        /* pchr -> pending-commit-heading-row */
                        <TableHeading key={`pchr-${index}`} width={heading.width}>
                            {heading.text}
                        </TableHeading>
                    ))}
                </TableHeader>
                <TableBody>
                    {commits.map((commit, index) => (
                        <CommitRow key={`pcr-${index}`} {...commit} provider={provider ?? null} uncommit={uncommit} />
                    ))}
                </TableBody>
            </Table>
        </PendingCommitsModal>
    );
}) as React.FC;

const Title = styled.h1`
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    color: #111928;
`;

const PendingCommitsModal = styled(Modal)`
    ${ModalInner} {
        max-width: 1010px;
        height: 700px;
    }
`;

const CommitRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
        uncommit: (pool: string, commitID: number) => void;
    }
> = ({ token, pool, id, txnHash, spent, tokenPrice, amount, nextRebalance, provider, uncommit }) => {
    return (
        <StyledTableRow>
            <TableCell>{token.name}</TableCell>
            <TableCell>{toApproxCurrency(spent)}</TableCell>
            <TableCell>{toApproxCurrency(tokenPrice)}</TableCell>
            <TableCell>{amount.toNumber()}</TableCell>
            <TableCell>
                <TimeLeft targetTime={nextRebalance.toNumber()} />
            </TableCell>
            <TableCell className="flex">
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
                                            className="flex text-sm items-center p-2 hover:bg-tracer-50"
                                            onClick={() => watchAsset(provider, token)}
                                        >
                                            <PlusOutlined className="relative inline mr-2 h-[12px]" />
                                            Add token to wallet
                                        </div>
                                        <div
                                            className="flex text-sm items-center p-2 hover:bg-tracer-50"
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
            </TableCell>
        </StyledTableRow>
    );
};

const StyledTableRow = styled(TableRow)`
    ${TableCell}:last-child {
        text-align: right;
    }
`;

// last heading is for buttons
const headings: Heading[] = [
    {
        text: 'TOKEN',
        width: 'auto',
    },
    {
        text: 'SPEND (USDC)',
        width: 'auto',
    },
    {
        text: 'TOKEN PRICE (USDC)',
        width: 'auto',
    },
    {
        text: 'AMOUNT (TOKENS)',
        width: 'auto',
    },
    {
        text: 'NEXT_REBALANCE',
        width: 'auto',
    },
    {
        text: '',
        width: '15%',
    },
];

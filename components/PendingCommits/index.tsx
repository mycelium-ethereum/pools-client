import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Table, TableBody, TableCell, TableHeader, TableHeading, TableRow } from '@components/General/Table';
import { Heading, QueuedCommit } from '@libs/types/General';
import usePendingCommits from '@libs/hooks/useQueuedCommits';
import { toApproxCurrency } from '@libs/utils';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions, useCommits } from '@context/UsersCommitContext';
import { usePoolActions } from '@context/PoolContext';
import { BUYS } from '@libs/constants';
import { Button, Logo } from '@components/General';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, SelectDropdown } from '@components/General/Input';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import { openEtherscan, watchAsset } from '@libs/utils/rpcMethods';

// TODO filter buys and sells
export default (() => {
    const { provider } = useWeb3();
    const ref = useRef(null);
    const { showCommits = false, focus = BUYS } = useCommits();
    const { commitDispatch = () => console.error('Dispatch undefined') } = useCommitActions();
    const { uncommit = () => console.error('uncommit undefined') } = usePoolActions();
    const commits = usePendingCommits();

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        const handleClickOutside = (event: any) => {
            if (ref.current && !(ref.current as any).contains(event.target)) {
                commitDispatch({
                    type: 'hide',
                });
            }
        };

        // Bind the event listener
        document?.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document?.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    return (
        <PendingCommits show={showCommits}>
            <Overlay show={showCommits} />
            <PendingCommitsModal ref={ref} show={showCommits}>
                <Title>Queued {focus === BUYS ? 'Buys' : 'Sells'}</Title>
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
                            <CommitRow
                                key={`pcr-${index}`}
                                {...commit}
                                provider={provider ?? null}
                                uncommit={uncommit}
                            />
                        ))}
                    </TableBody>
                </Table>
            </PendingCommitsModal>
        </PendingCommits>
    );
}) as React.FC<{
    show: boolean;
    // setShow: (val: boolean) => any
}>;

const Title = styled.h1`
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    color: #111928;
`;

const PendingCommits = styled.div<{ show: boolean }>``;

const Overlay = styled.div<{ show: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: 0.3s;
    opacity: ${(props) => (props.show ? 0.5 : 0)};
    background: black;
    z-index: ${(props) => (props.show ? 1 : -1)};
`;

const PendingCommitsModal = styled.div<{ show: boolean }>`
    transition: 0.3s;
    padding-top: ${(props) => (props.show ? '0' : '5vh')};
    opacity: ${(props) => (props.show ? 1 : 0)};
    position: absolute;
    width: 1010px;
    height: 700px;
    background: #fff;
    padding: 71px 65px;
    // z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    z-index: ${(props) => (props.show ? 2 : -1)};
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
            <TableCell>
                <Cancel onClick={() => uncommit(pool, id)}>Cancel</Cancel>
                <StyledSelect icon={<MoreOutlined />}>
                    <div>
                        <MenuRow onClick={() => watchAsset(provider, token)}>
                            <PlusOutlined />
                            Add token to wallet
                        </MenuRow>
                        <MenuRow onClick={() => openEtherscan(txnHash)}>
                            <Logo ticker={'ETHERSCAN'} />
                            View on Etherscan
                        </MenuRow>
                    </div>
                </StyledSelect>
            </TableCell>
        </StyledTableRow>
    );
};

const StyledTableRow = styled(TableRow)`
    ${TableCell}:last-child {
        text-align: right;
    }
`;

const StyledSelect = styled(Select)`
    width: 20px;
    display: inline;
    padding-left: 0;
    border: none;
    background: transparent;

    .anticon {
        vertical-align: 0;
        width: 26px;
    }

    & svg {
        color: #000;
        height: 20px;
        width: 20px;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    ${SelectDropdown} {
        left: -150px;
    }
`;

const MenuRow = styled.div`
    line-height: 14px;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0.5rem 0.5rem;
    & svg,
    ${Logo} {
        display: inline;
        position: relative;
        margin-right: 0.5rem;
    }
    & svg {
        height: 12px;
    }
    ${Logo} {
        width: 18px;
    }
    &:hover {
        background: #d1d5db;
    }
`;

const Cancel = styled(Button)`
    background: #dedeff;
    display: inline;
    border: 1px solid #3535dc;
    box-sizing: border-box;
    border-radius: 12px;
    width: 65px;
    height: 32px;
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

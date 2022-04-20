import React from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import Loading from '~/components/General/Loading';
import { Table, TableHeader, TableHeaderCell } from '~/components/General/TWTable';
import { useStore } from '~/store/main';
import { selectProvider } from '~/store/Web3Slice';
import { DenotedInEnum, TokenRowProps } from '../state';
import {TokenRow} from './TokenRow';

export default (({ rows, onClickCommitAction, denotedIn }) => {
    const provider = useStore(selectProvider);

    return (
        <>
            <Table fullHeight={false}>
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Value</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Acquisition Cost</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Unrealised PnL</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Leveraged Value</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
                <tbody>
                    {rows.map((token) => {
                        if (!token.holdings.eq(0)) {
                            return (
                                <TokenRow
                                    {...token}
                                    key={token.address}
                                    provider={provider ?? null}
                                    onClickCommitAction={onClickCommitAction}
                                    denotedIn={denotedIn}
                                />
                            );
                        }
                    })}
                </tbody>
            </Table>
            {!rows.length ? <Loading className="mx-auto my-8 w-10" /> : null}
        </>
    );
}) as React.FC<{
    rows: TokenRowProps[];
    onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
    denotedIn: DenotedInEnum;
}>;

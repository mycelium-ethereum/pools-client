import React from 'react';
import shallow from 'zustand/shallow';
import NoTableEntries from '~/components/General/NoTableEntries';
import { Table, TableHeader, TableHeaderCell } from '~/components/General/TWTable';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';
import { PoolsV1TokenRowProps, PoolsV1TokenRowActions } from '~/types/poolsV1Tokens';
import { PoolsV1TokenRow } from './PoolsV1TokenRow';

export const PoolsV1TokensTable = ({
    rows,
    onClickV1BurnAll
}: {
    rows: PoolsV1TokenRowProps[];
} & PoolsV1TokenRowActions): JSX.Element => {
    const { network } = useStore(selectWeb3Info, shallow);

    return (
        <>
            <Table fullHeight={false}>
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Value</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
                <tbody>
                    {rows.length === 0 ? (
                        <NoTableEntries>You have no pools v1 tokens.</NoTableEntries>
                    ) : (
                        rows.map((token) => (
                            <PoolsV1TokenRow
                                {...token}
                                key={token.address}
                                network={network}
                                poolStatus={token.poolStatus}
                                onClickV1BurnAll={onClickV1BurnAll}
                            />
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
};

export default PoolsV1TokensTable;

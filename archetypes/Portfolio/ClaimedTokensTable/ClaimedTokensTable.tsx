import React from 'react';
import NoTableEntries from '~/components/General/NoTableEntries';
import { Table, TableHeader, TableHeaderCell } from '~/components/General/TWTable';
import { useDeprecatedPools } from '~/hooks/useDeprecatedPools';
import { PoolStatus } from '~/types/pools';
import { ClaimedRowActions, ClaimedTokenRowProps } from '~/types/claimedTokens';
import { ClaimedTokenRow } from './ClaimedTokenRow';

export const ClaimedTokensTable = ({
    rows,
    onClickCommitAction,
    onClickStake,
}: {
    rows: ClaimedTokenRowProps[];
} & ClaimedRowActions): JSX.Element => {

    const deprecatedPools = useDeprecatedPools();

    return (
        <>
            <Table fullHeight={false}>
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Status</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Value</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Acquisition Cost</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Unrealised PnL</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Leveraged Value</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
                <tbody>
                    {rows.length === 0 ? (
                        <NoTableEntries>You have no claimed tokens.</NoTableEntries>
                    ) : (
                        rows.map((token) => (
                            <ClaimedTokenRow
                                {...token}
                                key={token.address}
                                poolStatus={deprecatedPools[token.poolAddress] ? PoolStatus.Deprecated : PoolStatus.Live}
                                onClickCommitAction={onClickCommitAction}
                                onClickStake={onClickStake}
                            />
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
};

export default ClaimedTokensTable;

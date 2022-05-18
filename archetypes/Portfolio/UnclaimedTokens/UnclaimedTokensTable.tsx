import React from 'react';
import { Logo } from '~/components/General';
import NoTableEntries from '~/components/General/NoTableEntries';
import { Table, TableHeader, TableHeaderCell } from '~/components/General/TWTable';
import { usePoolInstanceActions } from '~/hooks/usePoolInstanceActions';

import * as Styles from './styles';
import { ClaimableQuoteTokenRow, ClaimablePoolTokenRow } from './UnclaimedTokensRows';
import { UnclaimedRowInfo, OverviewPoolToken, TokenType, UnclaimedRowProps, OnClickCommit } from '../state';

export const UnclaimedTokensTable = ({
    rows,
    onClickCommitAction,
}: {
    rows: UnclaimedRowInfo[];
    onClickCommitAction: OnClickCommit;
}): JSX.Element => {
    return (
        <>
            <Table>
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Token Valuation</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Acquisition Cost</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Unrealised PnL</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Notional Value</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
                <tbody>
                    {rows.length === 0 ? (
                        <NoTableEntries>You have no unclaimed tokens.</NoTableEntries>
                    ) : (
                        rows
                            .sort((a, b) => a.marketTicker.localeCompare(b.marketTicker))
                            .map((pool) => {
                                return (
                                    !!pool.numClaimable && (
                                        <PoolRow
                                            key={pool.poolAddress}
                                            poolName={pool.poolName}
                                            poolAddress={pool.poolAddress}
                                            marketTicker={pool.marketTicker}
                                            claimableLongTokens={pool.claimableLongTokens}
                                            claimableShortTokens={pool.claimableShortTokens}
                                            claimableSettlementTokens={pool.claimableSettlementTokens}
                                            numClaimable={pool.numClaimable}
                                            claimableSum={pool.claimableSum}
                                            onClickCommitAction={onClickCommitAction}
                                        />
                                    )
                                );
                            })
                    )}
                </tbody>
            </Table>
        </>
    );
};

const PoolRow = ({
    poolName,
    poolAddress,
    marketTicker,
    claimableLongTokens,
    claimableShortTokens,
    claimableSettlementTokens,
    onClickCommitAction,
}: UnclaimedRowProps): JSX.Element => {
    const { claim } = usePoolInstanceActions();
    return (
        <>
            <Styles.PoolTableRow marketTicker={marketTicker}>
                <Styles.PoolTableRowCell variant="title">
                    <Logo size="lg" ticker={marketTicker} />
                    <Styles.PoolName>{poolName}</Styles.PoolName>
                </Styles.PoolTableRowCell>
                <Styles.PoolRowButtonCell>
                    <Styles.PoolRowButtons>
                        <Styles.ClaimButton marketTicker={marketTicker} onClick={() => claim(poolAddress)}>
                            CLAIM ALL
                            <Styles.ClaimButtonLogo size="sm" ticker={marketTicker} />
                            {poolName}
                        </Styles.ClaimButton>
                    </Styles.PoolRowButtons>
                </Styles.PoolRowButtonCell>
            </Styles.PoolTableRow>
            {[claimableLongTokens, claimableShortTokens, claimableSettlementTokens].map((claimableAsset) => {
                if (claimableAsset.type === TokenType.Settlement) {
                    return (
                        !claimableAsset.balance.eq(0) && (
                            <ClaimableQuoteTokenRow
                                key={`${poolAddress}-${claimableAsset.symbol}`}
                                {...claimableAsset}
                            />
                        )
                    );
                } else {
                    return (
                        !claimableAsset.balance.eq(0) && (
                            <ClaimablePoolTokenRow
                                key={`${poolAddress}-${claimableAsset.symbol}`}
                                poolAddress={poolAddress}
                                onClickCommitAction={onClickCommitAction}
                                settlementTokenSymbol={claimableSettlementTokens.symbol}
                                {...(claimableAsset as OverviewPoolToken)}
                            />
                        )
                    );
                }
            })}
        </>
    );
};

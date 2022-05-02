import React from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { Logo } from '~/components/General';
import Loading from '~/components/General/Loading';
import { Table, TableHeader, TableHeaderCell } from '~/components/General/TWTable';
import { usePoolInstanceActions } from '~/hooks/usePoolInstanceActions';

import { ClaimableQuoteTokenRow, ClaimablePoolTokenRow } from './ClaimableRows';
import * as Styles from './styles';
import { OverviewPoolToken, TokenType, EscrowRowProps } from '../state';

export const EscrowTable = (({ rows, onClickCommitAction }) => {
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
                    {rows
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
                        })}
                </tbody>
            </Table>
            {!rows.length ? <Loading className="mx-auto my-8 w-10" /> : null}
        </>
    );
}) as React.FC<{
    rows: EscrowRowProps[];
    onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
}>;

const PoolRow: React.FC<EscrowRowProps> = ({
    poolName,
    poolAddress,
    marketTicker,
    claimableLongTokens,
    claimableShortTokens,
    claimableSettlementTokens,
    // numClaimable,
    // claimableSum,
    onClickCommitAction,
}) => {
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

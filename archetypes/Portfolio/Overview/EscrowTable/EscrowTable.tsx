import React, { useState } from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { HiddenExpand, Logo } from '~/components/General';
import Loading from '~/components/General/Loading';
import { Table, TableHeader, TableHeaderCell } from '~/components/General/TWTable';
import { usePoolInstanceActions } from '~/hooks/usePoolInstanceActions';
import { toApproxCurrency } from '~/utils/converters';

import { ClaimableQuoteTokenRow, ClaimablePoolTokenRow } from './ClaimableRows';
import * as Styles from './styles';
import { ClaimablePoolToken, TokenType, EscrowRowProps } from '../state';

const ArrowDown = '/img/general/caret-down-white.svg';

export const EscrowTable = (({ rows, onClickCommitAction }) => {
    return (
        <>
            <Table>
                <tbody>
                    {rows.map((pool) => {
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
    numClaimable,
    claimableSum,
    onClickCommitAction,
}) => {
    const { claim } = usePoolInstanceActions();
    const [expanded, setExpanded] = useState<boolean>(false);
    return (
        <>
            <Styles.Pool>
                <Styles.Section variant="title">
                    <Logo size="lg" ticker={marketTicker} />
                    <Styles.PoolName>{poolName}</Styles.PoolName>
                </Styles.Section>
                <Styles.Section>
                    <Styles.InfoLabel>CLAIMABLE ASSETS</Styles.InfoLabel>
                    <Styles.Value>{numClaimable}</Styles.Value>
                </Styles.Section>
                <Styles.Section>
                    <Styles.InfoLabel>NET CLAIMABLE</Styles.InfoLabel>
                    <Styles.Value>{toApproxCurrency(claimableSum)}</Styles.Value>
                </Styles.Section>
                <Styles.Section variant="buttons">
                    <Styles.ClaimButton
                        variant="primary"
                        onClick={() =>
                            claim(poolAddress, {
                                onSuccess: () => {
                                    setExpanded(false);
                                },
                            })
                        }
                    >
                        CLAIM ALL
                    </Styles.ClaimButton>
                    <Styles.DropdownButton variant="primary" onClick={() => setExpanded(!expanded)}>
                        <Styles.DropdownArrow
                            className={expanded ? 'open' : ''}
                            src={ArrowDown}
                            alt="dropdown-toggle"
                        />
                    </Styles.DropdownButton>
                </Styles.Section>
            </Styles.Pool>
            <tr>
                <td>
                    <HiddenExpand defaultHeight={0} open={expanded}>
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
                                {[claimableLongTokens, claimableShortTokens, claimableSettlementTokens].map(
                                    (claimableAsset) => {
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
                                                        {...(claimableAsset as ClaimablePoolToken)}
                                                        poolAddress={poolAddress}
                                                        onClickCommitAction={onClickCommitAction}
                                                    />
                                                )
                                            );
                                        }
                                    },
                                )}
                            </tbody>
                        </Table>
                    </HiddenExpand>
                </td>
            </tr>
        </>
    );
};

import React, { useState } from 'react';
import { HiddenExpand, Logo } from '@components/General';
import Loading from '@components/General/Loading';
import { Table, TableHeader, TableHeaderCell } from '@components/General/TWTable';
import { toApproxCurrency } from '@libs/utils/converters';
import { usePoolActions } from '@context/PoolContext';

import * as Styles from './styles';
import { ClaimableQuoteTokenRow, ClaimablePoolTokenRow } from './ClaimableRows';
import { ClaimablePoolToken, TokenType } from '../state';

import { EscrowRowProps } from '../state';

const ArrowDown = '/img/general/caret-down-white.svg';

export const EscrowTable = (({ rows }) => {
    return (
        <>
            <div>
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
                            />
                        )
                    );
                })}
            </div>
            {!rows.length ? <Loading className="w-10 mx-auto my-8" /> : null}
        </>
    );
}) as React.FC<{
    rows: EscrowRowProps[];
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
}) => {
    const { claim = () => console.error('Failed to claim: claim function not defined in context') } = usePoolActions();
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
                                        !claimableAsset.balance.eq(0) && <ClaimableQuoteTokenRow {...claimableAsset} />
                                    );
                                } else {
                                    return (
                                        !claimableAsset.balance.eq(0) && (
                                            <ClaimablePoolTokenRow {...(claimableAsset as ClaimablePoolToken)} />
                                        )
                                    );
                                }
                            },
                        )}
                    </tbody>
                </Table>
            </HiddenExpand>
        </>
    );
};

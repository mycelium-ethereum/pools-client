import React from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { DeltaEnum } from '~/archetypes/Pools/state';
import { TableRow } from '~/components/General/TWTable';
import { PoolStatusBadge, PoolStatusBadgeContainer } from '~/components/PoolStatusBadge';
import Actions from '~/components/TokenActions';
import UpOrDown from '~/components/UpOrDown';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { PoolStatus } from '~/types/pools';
import { Market } from '../Market';
import { ActionsButton, ActionsCell } from '../OverviewTable/styles';
import { OverviewTableRowCell } from '../OverviewTable/styles';
import { OnClickCommit, TokenRowProps } from '../state';
import { TokensNotional } from '../Tokens';

export const ClaimedTokenRow: React.FC<
    TokenRowProps & {
        onClickCommitAction: OnClickCommit;
        status: PoolStatus;
    }
> = ({
    status,
    symbol,
    address,
    poolAddress,
    decimals,
    settlementTokenSymbol,
    side,
    balance,
    currentTokenPrice,
    onClickCommitAction,
    leveragedNotionalValue,
    entryPrice,
}) => {
    return (
        <TableRow lined>
            <OverviewTableRowCell>
                <Market tokenSymbol={symbol} isLong={side === SideEnum.long} />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <PoolStatusBadgeContainer>
                    <PoolStatusBadge status={status} />
                </PoolStatusBadgeContainer>
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <TokensNotional
                    amount={balance}
                    price={currentTokenPrice}
                    settlementTokenSymbol={settlementTokenSymbol}
                />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <TokensNotional amount={balance} price={entryPrice} settlementTokenSymbol={settlementTokenSymbol} />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <UpOrDown
                    oldValue={balance.times(entryPrice)}
                    newValue={balance.times(currentTokenPrice)}
                    deltaDenotation={DeltaEnum.Numeric}
                    currency={settlementTokenSymbol}
                    showCurrencyTicker={true}
                />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <div>{`${leveragedNotionalValue.toFixed(3)} ${settlementTokenSymbol}`}</div>
            </OverviewTableRowCell>
            <ActionsCell>
                <ActionsButton
                    size="xs"
                    variant="primary-light"
                    disabled={!balance.toNumber()}
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.burn)}
                >
                    Burn
                </ActionsButton>
                <ActionsButton
                    size="xs"
                    variant="primary-light"
                    disabled={!balance.toNumber()}
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.flip)}
                >
                    Flip
                </ActionsButton>
                <Actions
                    token={{
                        address,
                        symbol,
                        decimals,
                    }}
                    arbiscanTarget={{
                        type: BlockExplorerAddressType.token,
                        target: address,
                    }}
                />
            </ActionsCell>
        </TableRow>
    );
};

export default ClaimedTokenRow;

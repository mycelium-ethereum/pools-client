import React from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { DeltaEnum } from '~/archetypes/Pools/state';
import { TableRow } from '~/components/General/TWTable';
import { PoolStatusBadge, PoolStatusBadgeContainer } from '~/components/PoolStatusBadge';
import Actions from '~/components/TokenActions';
import TooltipSelector, { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import UpOrDown from '~/components/UpOrDown';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { PoolStatus } from '~/types/pools';
import { Market, SettlementToken } from '../Market';
import { OverviewTableRowCell, ActionsCell, ActionsButton } from '../OverviewTable/styles';
import { OverviewAsset, ClaimablePoolTokenRowProps } from '../state';
import { TokensNotional } from '../Tokens';

export const ClaimablePoolTokenRow: React.FC<ClaimablePoolTokenRowProps & { settlementTokenSymbol: string }> = ({
    status,
    balance,
    leveragedNotionalValue,
    entryPrice,
    currentTokenPrice,
    onClickCommitAction,
    symbol,
    address,
    decimals,
    side,
    poolAddress,
    settlementTokenSymbol,
}) => {
    const poolIsDeprecated = status === PoolStatus.Deprecated;

    return (
        <TableRow>
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
                <div>
                    <UpOrDown
                        oldValue={balance.times(entryPrice)}
                        newValue={balance.times(currentTokenPrice)}
                        deltaDenotation={DeltaEnum.Numeric}
                        currency={settlementTokenSymbol}
                        showCurrencyTicker={true}
                    />
                </div>
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <div>{`${leveragedNotionalValue.toFixed(3)} ${settlementTokenSymbol}`}</div>
            </OverviewTableRowCell>
            <ActionsCell>
                <ActionsButton
                    size="xs"
                    variant="primary-light"
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.burn, true)}
                >
                    Burn
                </ActionsButton>
                <TooltipSelector
                    tooltip={{
                        key: poolIsDeprecated ? TooltipKeys.DeprecatedPoolFlipCommit : undefined,
                    }}
                >
                    <ActionsButton
                        size="xs"
                        variant="primary-light"
                        disabled={poolIsDeprecated}
                        onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.flip, true)}
                    >
                        Flip
                    </ActionsButton>
                </TooltipSelector>
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

export const ClaimableQuoteTokenRow: React.FC<OverviewAsset> = ({ symbol, balance, address, decimals }) => (
    <TableRow>
        <OverviewTableRowCell>
            <SettlementToken tokenSymbol={symbol} />
        </OverviewTableRowCell>
        <OverviewTableRowCell>
            <div>
                {balance.toFixed(2)} {symbol}
            </div>
        </OverviewTableRowCell>
        <OverviewTableRowCell>
            <div>-</div>
        </OverviewTableRowCell>
        <OverviewTableRowCell>
            <div>-</div>
        </OverviewTableRowCell>
        <OverviewTableRowCell>
            <div>-</div>
        </OverviewTableRowCell>
        <ActionsCell>
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

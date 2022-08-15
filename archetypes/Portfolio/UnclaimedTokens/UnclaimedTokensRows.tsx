import React from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import SlimButton from '~/components/General/Button/SlimButton';
import { TableRow } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import TooltipSelector, { TooltipKeys } from '~/components/Tooltips/TooltipSelector';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { PoolStatus } from '~/types/pools';
import { OverviewAsset } from '~/types/portfolio';
import { UnclaimedPoolTokenRowProps } from '~/types/unclaimedTokens';
import { Market, SettlementToken } from '../Market';
import { OverviewTableRowCell, ActionsCell } from '../OverviewTable/styles';
import { TokensNotional } from '../Tokens';

export const UnclaimedPoolTokenRow = ({
    balance,
    leveragedNotionalValue,
    currentTokenPrice,
    onClickCommitAction,
    symbol,
    address,
    decimals,
    side,
    poolAddress,
    settlementTokenSymbol,
    poolStatus,
}: UnclaimedPoolTokenRowProps): JSX.Element => {
    const poolIsDeprecated = poolStatus === PoolStatus.Deprecated;

    return (
        <TableRow>
            <OverviewTableRowCell>
                <Market tokenSymbol={symbol} isLong={side === SideEnum.long} />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <TokensNotional
                    amount={balance}
                    price={currentTokenPrice}
                    settlementTokenSymbol={settlementTokenSymbol}
                />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                <div>{`${leveragedNotionalValue.toFixed(3)} ${settlementTokenSymbol}`}</div>
            </OverviewTableRowCell>
            <ActionsCell>
                <SlimButton
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.burn, true)}
                    content={<>Burn</>}
                />
                <TooltipSelector
                    tooltip={{
                        key: poolIsDeprecated ? TooltipKeys.DeprecatedPoolFlipCommit : undefined,
                    }}
                >
                    <div>
                        <SlimButton
                            onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.burn, true)}
                            content={<>Flip</>}
                        />
                    </div>
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

export const UnclaimedQuoteTokenRow = ({ symbol, balance, address, decimals }: OverviewAsset): JSX.Element => (
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

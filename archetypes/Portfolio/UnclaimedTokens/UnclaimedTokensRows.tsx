import React from 'react';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { DeltaEnum } from '~/archetypes/Pools/state';
import { TableRow } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import UpOrDown from '~/components/UpOrDown';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { OverviewAsset } from '~/types/portfolio';
import { UnclaimedPoolTokenRowProps } from '~/types/unclaimedTokens';
import { Market, SettlementToken } from '../Market';
import { OverviewTableRowCell, ActionsCell, ActionsButton } from '../OverviewTable/styles';
import { TokensNotional } from '../Tokens';

export const UnclaimedPoolTokenRow = ({
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
}: UnclaimedPoolTokenRowProps): JSX.Element => {
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
                <ActionsButton
                    size="xs"
                    variant="primary-light"
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.flip, true)}
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

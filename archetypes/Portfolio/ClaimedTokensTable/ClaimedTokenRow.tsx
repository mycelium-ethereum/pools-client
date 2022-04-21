import React from 'react';
import BigNumber from 'bignumber.js';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { DeltaEnum } from '~/archetypes/Pools/state';
import { TableRow } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import UpOrDown from '~/components/UpOrDown';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { toApproxCurrency } from '~/utils/converters';
import { Market } from '../Market';
import { ActionsButton, ActionsCell } from '../OverviewTable/styles';
import { OverviewTableRowCell } from '../OverviewTable/styles';
import { DenotedInEnum, TokenRowProps } from '../state';
import { TokensNotional } from '../Tokens';

export const ClaimedTokenRow: React.FC<
    TokenRowProps & {
        onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
        denotedIn: DenotedInEnum;
    }
> = ({
    symbol,
    name,
    address,
    poolAddress,
    decimals,
    settlementTokenSymbol,
    side,
    balance,
    currentTokenPrice,
    onClickCommitAction,
    oraclePrice,
    denotedIn,
    notionalValue,
    entryPrice,
}) => {
    const BaseNumDenote = (notionalValue: BigNumber, oraclePrice: BigNumber, name: string, leverage?: number) => {
        if (notionalValue.eq(0)) {
            return notionalValue.toFixed(2);
        } else if (name.split('-')[1].split('/')[0] === 'BTC') {
            return leverage
                ? ((notionalValue.toNumber() / oraclePrice.toNumber()) * leverage).toFixed(8)
                : (notionalValue.toNumber() / oraclePrice.toNumber()).toFixed(8);
        } else if (name.split('-')[1].split('/')[0] === 'ETH') {
            return leverage
                ? ((notionalValue.toNumber() / oraclePrice.toNumber()) * leverage).toFixed(6)
                : (notionalValue.toNumber() / oraclePrice.toNumber()).toFixed(6);
        }
    };

    const NotionalDenote = (notionalValue: BigNumber, leverage?: number) => {
        return leverage ? toApproxCurrency(notionalValue.toNumber() * leverage) : toApproxCurrency(notionalValue);
    };

    return (
        <TableRow lined>
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
                <UpOrDown
                    oldValue={balance.times(entryPrice)}
                    newValue={balance.times(currentTokenPrice)}
                    deltaDenotation={DeltaEnum.Numeric}
                    currency={settlementTokenSymbol}
                    showCurrencyTicker={true}
                />
            </OverviewTableRowCell>
            <OverviewTableRowCell>
                {denotedIn === DenotedInEnum.BASE ? (
                    <>
                        {BaseNumDenote(notionalValue, oraclePrice, name, parseInt(name.split('-')[0][0]))}{' '}
                        {name.split('-')[1].split('/')[0]}
                    </>
                ) : (
                    `${NotionalDenote(notionalValue, parseInt(name.split('-')[0][0]))} USD`
                )}
            </OverviewTableRowCell>
            <ActionsCell>
                <ActionsButton
                    size="xs"
                    variant="primary-light"
                    disabled={!notionalValue.toNumber()}
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.burn)}
                >
                    Burn
                </ActionsButton>
                <ActionsButton
                    size="xs"
                    variant="primary-light"
                    disabled={!notionalValue.toNumber()}
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

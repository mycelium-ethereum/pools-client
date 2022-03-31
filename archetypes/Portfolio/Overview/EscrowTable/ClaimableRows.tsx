import React from 'react';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { DeltaEnum } from '@archetypes/Pools/state';
import { TableRowCell, TableRow } from '@components/General/TWTable';
import UpOrDown from '@components/UpOrDown';
import { toApproxCurrency } from '~/utils/converters';
import { TokenType, InnerText, EscrowButton, Buttons } from './styles';
import { ClaimableAsset, ClaimablePoolTokenRowProps } from '../state';

export const ClaimablePoolTokenRow: React.FC<ClaimablePoolTokenRowProps> = ({
    balance,
    notionalValue,
    entryPrice,
    currentTokenPrice,
    onClickCommitAction,
    type,
    side,
    poolAddress,
}) => {
    // TODO assume this will want to be interchangeable with USD
    const currency = 'USD';

    return (
        <TableRow>
            <TableRowCell>
                <TokenType type={type}>{type}</TokenType>
            </TableRowCell>
            <TableRowCell>
                <InnerText>{toApproxCurrency(currentTokenPrice.times(balance), 3)}</InnerText>
                <InnerText className="sub-text">
                    {`${balance.toFixed(3)} tokens at ${currentTokenPrice.toFixed(3)} ${currency}`}
                </InnerText>
            </TableRowCell>
            <TableRowCell>
                <InnerText>{toApproxCurrency(entryPrice.tokenPrice.times(balance), 3)}</InnerText>
                <InnerText className="sub-text">
                    {`${balance.toFixed(3)} tokens at ${entryPrice.tokenPrice.toFixed(3)} ${currency}`}
                </InnerText>
            </TableRowCell>
            <TableRowCell>
                <InnerText>
                    <UpOrDown
                        oldValue={entryPrice ? balance.times(entryPrice.tokenPrice) : balance.times(currentTokenPrice)}
                        newValue={balance.times(currentTokenPrice)}
                        deltaDenotation={DeltaEnum.Numeric}
                        currency={currency}
                        showCurrencyTicker={true}
                    />
                </InnerText>
            </TableRowCell>
            <TableRowCell>
                <InnerText>{`${notionalValue.toFixed(3)} ${currency}`}</InnerText>
            </TableRowCell>
            {type !== TokenType.Settlement ? (
                <Buttons>
                    <EscrowButton
                        size="xs"
                        variant="primary-light"
                        onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.burn)}
                    >
                        Burn
                    </EscrowButton>
                    <EscrowButton
                        size="xs"
                        variant="primary-light"
                        onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.flip)}
                    >
                        Flip
                    </EscrowButton>
                </Buttons>
            ) : null}
        </TableRow>
    );
};

export const ClaimableQuoteTokenRow: React.FC<ClaimableAsset> = ({ type, symbol, balance }) => (
    <TableRow>
        <TableRowCell>
            <TokenType type={type}>{type}</TokenType>
        </TableRowCell>
        <TableRowCell>
            <InnerText>
                {balance.toFixed(2)} {symbol}
            </InnerText>
        </TableRowCell>
        <TableRowCell>
            <InnerText>-</InnerText>
        </TableRowCell>
        <TableRowCell>
            <InnerText>-</InnerText>
        </TableRowCell>
        <TableRowCell>
            <InnerText>-</InnerText>
        </TableRowCell>
        <TableRowCell />
    </TableRow>
);

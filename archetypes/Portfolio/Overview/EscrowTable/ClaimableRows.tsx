import React from 'react';
import { DeltaEnum } from '@archetypes/Pools/state';
import { TableRowCell, TableRow } from '@components/General/TWTable';
import UpOrDown from '@components/UpOrDown';
import { toApproxCurrency } from '~/utils/converters';
import { TokenType, InnerText, EscrowButton, Buttons } from './styles';
import { ClaimableAsset, ClaimablePoolToken } from '../state';

export const ClaimablePoolTokenRow: React.FC<ClaimablePoolToken> = ({
    token,
    balance,
    notionalValue,
    entryPrice,
    currentTokenPrice,
}) => {
    // TODO assume this will want to be interchangeable with USD
    const currency = 'USD';

    return (
        <TableRow>
            <TableRowCell>
                <TokenType type={token}>{token}</TokenType>
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
            <Buttons>
                <EscrowButton size="sm" variant="primary-light">
                    Burn
                </EscrowButton>
                <EscrowButton size="sm" variant="primary-light">
                    Flip
                </EscrowButton>
            </Buttons>
        </TableRow>
    );
};

export const ClaimableQuoteTokenRow: React.FC<ClaimableAsset> = ({ token, balance }) => (
    <TableRow>
        <TableRowCell>
            <TokenType type={token}>{token}</TokenType>
        </TableRowCell>
        <TableRowCell>
            <InnerText>
                {balance.toFixed(2)} {token}
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

import React, { useState } from 'react';
import { Table, TableHeader, TableHeaderCell, TableRowCell, TableRow } from '@components/General/TWTable';
import Loading from '@components/General/Loading';
import { EscrowRowProps, ClaimableAsset, ClaimablePoolToken, TokenType as TokenTypeEnum } from '../state';
import { HiddenExpand, Logo } from '@components/General';
import Button from '@components/General/Button';
import styled from 'styled-components';
import UpOrDown from '@components/UpOrDown';
import { DeltaEnum } from '@archetypes/Pools/state';
import { toApproxCurrency } from '@libs/utils/converters';
import { usePoolActions } from '@context/PoolContext';

const ArrowDown = '/img/general/caret-down-white.svg';

export default (({ rows }) => {
    // const { provider } = useWeb3();
    return (
        <>
            <div>
                {rows.map((pool) => {
                    return <PoolRow key={pool.poolAddress} {...pool} />;
                })}
            </div>
            {!rows.length ? <Loading className="w-10 mx-auto my-8" /> : null}
        </>
    );
}) as React.FC<{
    rows: EscrowRowProps[];
}>;

const Pool = styled.div`
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme['background-secondary']};
    display: flex;
    border-radius: 10px;
    overflow-x: auto;
    margin-top: 1rem;
`;

const PoolName = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 150%;
    margin-left: 1rem;
    white-space: nowrap;
`;

const InfoLabel = styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;
    white-space: nowrap;

    color: #6b7280;
`;

const Value = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 150%;
`;

const Section = styled.div`
    margin: 1rem 2rem;

    &.title-section {
        display: flex;
        align-items: center;
        width: 100%;
    }

    &.buttons {
        display: flex;
    }
`;

const ClaimButton = styled(Button)`
    height: 44px;
    width: 112px !important;
    margin-right: 0.5rem;
`;

const DropdownButton = styled(Button)`
    width: 44px !important;
    height: 44px;
    text-align: center;
`;

const DropdownArrow = styled.img`
    width: 10px;
`;

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
            <Pool>
                <Section className="title-section">
                    <Logo size="lg" ticker={marketTicker} />
                    <PoolName>{poolName}</PoolName>
                </Section>
                <Section>
                    <InfoLabel>CLAIMABLE ASSETS</InfoLabel>
                    <Value>{numClaimable}</Value>
                </Section>
                <Section>
                    <InfoLabel>NET CLAIMABLE</InfoLabel>
                    <Value>{toApproxCurrency(claimableSum)}</Value>
                </Section>
                <Section className="buttons">
                    <ClaimButton
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
                    </ClaimButton>
                    <DropdownButton variant="primary" onClick={() => setExpanded(!expanded)}>
                        <DropdownArrow className={expanded ? 'open' : ''} src={ArrowDown} alt="dropdown-toggle" />
                    </DropdownButton>
                </Section>
            </Pool>
            <HiddenExpand defaultHeight={0} open={expanded}>
                <DropdownTable
                    claimableAssets={[claimableLongTokens, claimableShortTokens, claimableSettlementTokens]}
                />
            </HiddenExpand>
        </>
    );
};

const DropdownTable: React.FC<{
    claimableAssets: (ClaimableAsset | ClaimablePoolToken)[];
}> = ({ claimableAssets }) => {
    return (
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
            {claimableAssets.map((claimableAsset) => {
                if (claimableAsset.type === TokenTypeEnum.Settlement) {
                    return <ClaimableQuoteTokenRow {...claimableAsset} />;
                } else {
                    return <ClaimablePoolTokenRow {...(claimableAsset as ClaimablePoolToken)} />;
                }
            })}
        </Table>
    );
};

const InnerText = styled.div`
    /* text-base/font-normal */
    font-family: Source Sans Pro, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 150%;

    &.sub-text {
        opacity: 0.8;
    }
`;

const TokenType = styled.div.attrs<{ type: ClaimableAsset['token'] }>((props) => ({
    type: props.type,
}))<{ type: ClaimableAsset['token'] }>`
    color: ${({ type }) => {
        switch (type) {
            case 'Long':
                return '#0E9F6E';
            case 'Short':
                return '#F05252';
            default:
                return 'inherit';
        }
    }};
`;

const EscrowButton = styled(Button)`
    width: 60px !important;
    &:first-child {
        margin-right: 0.5rem;
    }
`;

const Buttons = styled(TableRowCell)`
    text-align: right;
`;

const ClaimablePoolTokenRow: React.FC<ClaimablePoolToken> = ({
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
                    {`${balance} tokens at ${currentTokenPrice.toFixed(3)} ${currency}`}
                </InnerText>
            </TableRowCell>
            <TableRowCell>
                <InnerText>{toApproxCurrency(entryPrice.tokenPrice.times(balance), 3)}</InnerText>
                <InnerText className="sub-text">
                    {`${balance} tokens at ${entryPrice.tokenPrice.toFixed(3)} ${currency}`}
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
const ClaimableQuoteTokenRow: React.FC<ClaimableAsset> = ({ token, balance }) => {
    return (
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
};

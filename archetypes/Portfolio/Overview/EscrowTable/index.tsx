import React, { useState } from 'react';
import { Table, TableHeader, TableHeaderCell, TableRowCell, TableRow } from '@components/General/TWTable';
import Loading from '@components/General/Loading';
import { EscrowRowProps, ClaimableAsset } from '../state';
import { HiddenExpand, Logo } from '@components/General';
import Button from '@components/General/Button';
import styled from 'styled-components';
import UpOrDown from '@components/UpOrDown';
import {DeltaEnum} from '@archetypes/Pools/state';

const ArrowDown = '/img/general/caret-down-white.svg';

export default (({ rows }) => {
    // const { provider } = useWeb3();
    return (
        <>
            <div>
                {rows.map((pool) => {
                    // if (!token.holdings.eq(0)) {
                        return (
                            <PoolRow 
                                {...pool}
                            />
                        );
                    // }
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

`

const PoolName = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 150%;
    margin-left: 1rem;
`

const InfoLabel = styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;
    white-space: nowrap;

    color: #6B7280;
`

const Value = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 150%;
`

const Section = styled.div`
    margin: 1rem 2rem;

    &.title-section {
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 500px;
    }

    &.buttons {
        display: flex;
    }
`

const ClaimButton = styled(Button)`
    height: 44px;
    width: 112px!important;
    margin-right: 0.5rem;
`

const DropdownButton = styled(Button)`
    width: 44px!important;
    height: 44px;
    text-align: center;
`

const DropdownArrow = styled.img`
    width: 10px;
`



const PoolRow: React.FC<EscrowRowProps> = ({ pool, marketTicker, claimableAssets }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    return (
        <>
            <Pool>
                <Section className="title-section">
                    <Logo size="lg" ticker={marketTicker} />
                    <PoolName>
                        {pool}
                    </PoolName>
                </Section>
                <Section>
                    <InfoLabel>
                        CLAIMABLE ASSETS
                    </InfoLabel>
                    <Value>
                        {claimableAssets.length}
                    </Value>
                </Section>
                <Section>
                    <InfoLabel>
                        NET CLAIMABLE
                    </InfoLabel>
                    <Value>
                        {claimableAssets.reduce((sum, asset) => sum + asset.balance, 0)}
                    </Value>
                </Section>
                <Section className="buttons">
                    <ClaimButton variant="primary">
                        CLAIM ALL
                    </ClaimButton>
                    <DropdownButton variant="primary" onClick={() => setExpanded(!expanded)}>
                        <DropdownArrow
                            className={expanded ? 'open' : ''}
                            src={ArrowDown}
                            alt="dropdown-toggle"
                        />
                    </DropdownButton>
                </Section>
            </Pool>
            <HiddenExpand defaultHeight={0} open={expanded}>
                <DropdownTable claimableAssets={claimableAssets} />
            </HiddenExpand>
        </>
    )
}

const DropdownTable: React.FC<{ 
    claimableAssets: EscrowRowProps['claimableAssets'] 
}> = ({ 
    claimableAssets 
}) => {
    return (
        <Table>
            <TableHeader>
                <TableHeaderCell>Token</TableHeaderCell>
                <TableHeaderCell className="whitespace-nowrap">Token Valuation</TableHeaderCell>
                <TableHeaderCell className="whitespace-nowrap">Acquisition Cost</TableHeaderCell>
                <TableHeaderCell className="whitespace-nowrap">Unrealised PnL</TableHeaderCell>
                <TableHeaderCell className="whitespace-nowrap">Notional Value</TableHeaderCell>
                <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
            </TableHeader>
            {claimableAssets.map((claimableAsset) => <ClaimableAssetRow {...claimableAsset} />)}
        </Table>
    )
}



const InnerText = styled.div`
    /* text-base/font-normal */

    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 150%;
    
    &.sub-text {
        opacity: 0.8;
    }
`


const TokenType = styled.div.attrs<{ type: ClaimableAsset['token'] }>(props => ({
    type: props.type
}))<{ type: ClaimableAsset['token'] }>`
    color: ${({ type }) => {
        switch (type) {
            case 'Long':
                return '#0E9F6E';
            case 'Short':
                return '#F05252';
        }
    }}
`


const EscrowButton = styled(Button)`
    width: 60px!important;
    &:first-child {
        margin-right: 0.5rem;
    }
`

const Buttons = styled(TableRowCell)`
    text-align: right;
`

const ClaimableAssetRow:React.FC<ClaimableAsset> = ({
    token,
    balance,
    notionalValue,
    unrealisedPNL
}) => {
    
    // TODO assume this will want to be interchangeable with USD
    const currency ='ETH';

    return (
        <TableRow rowNumber={0}>
            <TableRowCell>
                <TokenType type={token}>
                    {token}
                </TokenType>
            </TableRowCell>
            <TableRowCell>
                <InnerText>
                    {balance}
                </InnerText>
                <InnerText className="sub-text">
                    {`1500 tokens at 0.004 ${currency}`}
                </InnerText>
            </TableRowCell>
            <TableRowCell>
                <InnerText>
                    {balance}
                </InnerText>
                <InnerText className="sub-text">
                    {`1500 tokens at 0.004 ${currency}`}
                </InnerText>
            </TableRowCell>
            <TableRowCell>
                <InnerText>
                    <UpOrDown
                        oldValue={unrealisedPNL}
                        newValue={unrealisedPNL + (Math.random() * 10)}
                        deltaDenotion={DeltaEnum.Numeric}
                        currency={currency}
                        showCurrencyTicker={true}
                    />
                </InnerText>
            </TableRowCell>
            <TableRowCell>
                <InnerText>
                    {`${notionalValue} ${currency}`}
                </InnerText>
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
    )
}



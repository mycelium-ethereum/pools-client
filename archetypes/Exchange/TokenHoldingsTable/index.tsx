import React, { useMemo } from 'react';
import { HiddenExpand } from '@components/General';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import styled from 'styled-components';
import { SideEnum } from '@libs/constants';
import useEscrowHoldings from '@libs/hooks/useEscrowHoldings';
import { PoolInfo } from '@context/PoolContext/poolDispatch';

interface FeeNoteProps {
    pool: any;
    side: any;
    userBalances: PoolInfo['userBalances'];
}

const TokenHoldingsTable: React.FC<FeeNoteProps> = ({ pool, side, userBalances }) => {
    const escrowRows = useEscrowHoldings();

    const filteredEscrow = useMemo(() => escrowRows.filter((v) => v.poolAddress === pool.address), [pool]);

    const isLong = side === SideEnum.long;
    const claimableType = isLong ? 'claimableLongTokens' : 'claimableShortTokens';
    const oppositeClaimableType = isLong ? 'claimableShortTokens' : 'claimableLongTokens';
    const escrowBalance = filteredEscrow?.[0]?.[claimableType]?.balance?.toNumber();
    const oppositeEscrowBalance = filteredEscrow?.[0]?.[oppositeClaimableType]?.balance?.toNumber();

    const [tokenBalance, oppositeTokenBalance] = useMemo(
        () =>
            isLong
                ? [userBalances.longToken, userBalances.shortToken]
                : [userBalances.shortToken, userBalances.longToken],
        [isLong, userBalances.longToken, userBalances.shortToken],
    );

    const [currentToken, oppositeCurrentToken] = useMemo(
        () => (isLong ? [pool.longToken, pool.shortToken] : [pool.shortToken, pool.longToken]),
        [isLong, pool.longToken, pool.shortToken],
    );

    return (
        <StyledHiddenExpand defaultHeight={0} open>
            <Table>
                <Head>
                    <Row>
                        <HeaderCell>Token</HeaderCell>
                        <HeaderCell>Escrow</HeaderCell>
                        <HeaderCell>Walet</HeaderCell>
                    </Row>
                </Head>
                <Body>
                    <Row>
                        <DataCell hasLogo>
                            <Logo className="inline" size="md" ticker={tokenSymbolToLogoTicker(currentToken.symbol)} />
                            {currentToken.symbol}+{pool?.quoteToken?.symbol}-01
                        </DataCell>
                        <DataCell hasBalance={escrowBalance > 0}>
                            {escrowBalance > 0 ? (
                                <>
                                    {escrowBalance?.toFixed(2)}
                                    <span>Tokens</span>
                                </>
                            ) : (
                                '0.00'
                            )}
                        </DataCell>
                        <DataCell hasBalance={tokenBalance.balance.toNumber() > 0}>
                            {tokenBalance.balance.toNumber() > 0 ? (
                                <>
                                    {tokenBalance.balance.toNumber().toFixed(2)}
                                    <span>Tokens</span>
                                </>
                            ) : (
                                '0.00'
                            )}
                        </DataCell>
                    </Row>
                    <Row>
                        <DataCell hasLogo>
                            <Logo
                                className="inline"
                                size="md"
                                ticker={tokenSymbolToLogoTicker(oppositeCurrentToken.symbol)}
                            />
                            {oppositeCurrentToken.symbol}+{pool?.quoteToken?.symbol}-01
                        </DataCell>
                        <DataCell hasBalance={oppositeEscrowBalance > 0}>
                            {oppositeEscrowBalance > 0 ? (
                                <>
                                    {oppositeEscrowBalance?.toFixed(2)}
                                    <span>Tokens</span>
                                </>
                            ) : (
                                '0.00'
                            )}
                        </DataCell>
                        <DataCell hasBalance={oppositeTokenBalance.balance.toNumber() > 0}>
                            {oppositeTokenBalance.balance.toNumber() > 0 ? (
                                <>
                                    {oppositeTokenBalance.balance.toNumber().toFixed(2)}
                                    <span>Tokens</span>
                                </>
                            ) : (
                                '0.00'
                            )}
                        </DataCell>
                    </Row>
                </Body>
            </Table>
        </StyledHiddenExpand>
    );
};
export default TokenHoldingsTable;

const StyledHiddenExpand = styled(HiddenExpand)`
    margin: 10px 0 50px !important;

    @media (min-width: 640px) {
        margin: -10px 0 55px !important;
    }
`;

const Table = styled.table`
    width: 100%;
    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04);
    border-radius: 7px;
    overflow: hidden;
    font-weight: 600;
    font-size: 14px;
`;

const Row = styled.tr`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    padding: 0.6rem;

    td {
        position: relative;
    }

    td:not(:last-child):after {
        content: '';
        position: absolute;
        top: 10px;
        right: 0;
        height: 40%;
        width: 1px;
        background: ${({ theme }) => (theme.isDark ? '#F9FAFB' : '#E5E7EB')};
    }
`;

const Head = styled.thead`
    background-color: ${({ theme }) => theme['border-secondary']};
    padding: 1rem;
    text-align: center;
`;

const HeaderCell = styled.th`
    position: relative;
    &:not(:last-child):after {
        content: '';
        position: absolute;
        top: 4px;
        right: 0;
        height: 70%;
        width: 1px;
        background: ${({ theme }) => (theme.isDark ? '' : theme.text)};
    }
`;

const Body = styled.tbody`
    background-color: ${({ theme }) => (theme.isDark ? theme['button-bg'] : theme.backgroud)};
`;

const DataCell = styled.td<{ hasLogo?: boolean; hasBalance?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;

    svg {
        margin-right: 10px;
    }

    span {
        color: #6b7280;
    }

    ${({ hasLogo, hasBalance }) => {
        if (hasLogo) {
            return `
                justify-content: flex-start;
            `;
        }

        if (hasBalance) {
            return `
                flex-direction: column;
            `;
        }
    }}

    @media (min-width: 640px) {
        font-size: 14px;
    }
`;

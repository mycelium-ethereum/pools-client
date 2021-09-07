import React from 'react';
import { TableCell, TableRow } from '@components/General/Table';
import { toApproxCurrency } from '@libs/utils';
import { Button } from '@components/General';
import styled from 'styled-components';
import { Pool, PoolType } from '@libs/types/General';
import { SHORT, LONG, MINT, BURN } from '@libs/constants';
import { usePool } from '@context/PoolContext';
import { calcTokenPrice } from '@libs/utils/calcs';
import Link from 'next/link';

// const PoolRows
export default (({ poolInfo }) => {
    const pool = usePool(poolInfo.address);

    return (
        <>
            <TokenRow pool={pool} isShortToken={true} />
            <TokenRow pool={pool} isShortToken={false} />
        </>
    );
}) as React.FC<{
    poolInfo: PoolType;
}>;

const TokenRow: React.FC<{
    pool: Pool;
    isShortToken: boolean;
}> = ({ pool, isShortToken }) => {
    const balance = isShortToken ? pool.shortBalance : pool.longBalance;
    const token = isShortToken ? pool.shortToken : pool.longToken;
    return (
        <StyledTableRow>
            {/** Token name */}
            <TableCell>{token.name}</TableCell>

            {/** Last Price */}
            <TableCell>{toApproxCurrency(calcTokenPrice(balance, token.supply))}</TableCell>

            {/** 24H Change */}
            <TableCell>{toApproxCurrency(pool.oraclePrice)}</TableCell>

            {/** Rebalance Multiplier */}
            <TableCell></TableCell>

            {/** TVL */}
            <TableCell>{toApproxCurrency(balance)}</TableCell>

            {/** My Holdings */}
            <TableCell>{token.balance.toFixed(3)}</TableCell>
            <TableCell>
                <Link
                    href={{
                        pathname: '/',
                        query: { pool: pool.address, type: MINT, side: isShortToken ? SHORT : LONG },
                    }}
                >
                    <StyledButton>Mint</StyledButton>
                </Link>
                <Link
                    href={{
                        pathname: '/',
                        query: { pool: pool.address, type: BURN, side: isShortToken ? SHORT : LONG },
                    }}
                >
                    <StyledButton>Burn</StyledButton>
                </Link>
            </TableCell>
        </StyledTableRow>
    );
};

const StyledButton = styled(Button)`
    display: inline;
    border: 1px solid #3535dc;
    border-radius: 12px;
    background: #dedeff;
    width: 65px;
    height: 32px;
    font-size: 12px;
    color: #374151;
    &:first-child {
        margin-right: 1rem;
    }
`;

const StyledTableRow = styled(TableRow)`
    ${TableCell}:last-child {
        text-align: right;
    }
`;

// const MarketChange = (styled(({ marketChange, className }) => (
//     <span className={className}>
//         {`${marketChange.toFixed(2)}%`}
//     </span>
// ))`
//     color: ${props => props.marketChange > 0 ? 'var(--color-green)' : 'var(--color-red)'};

// `) as React.FC<{
//     marketChange: number
// }>

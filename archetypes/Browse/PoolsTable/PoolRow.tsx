import React from 'react';
import { TableCell, TableRow } from '@components/General/Table';
import { toApproxCurrency } from '@libs/utils';
import { Button } from '@components/General';
import styled from 'styled-components';
import { PoolType } from '@libs/types/General';
import { SHORT, LONG, MINT, BURN } from '@libs/constants';
import { usePool } from '@context/PoolContext';
import { calcTokenPrice } from '@libs/utils/calcs';
import Link from 'next/link';

export default (({ poolInfo }) => {
    const pool = usePool(poolInfo.address);
    const { shortToken, longToken } = pool;

    return (
        <>
            <StyledTableRow>
                {/** Token name */}
                <TableCell>{shortToken.name}</TableCell>

                {/** Last Price */}
                <TableCell>{toApproxCurrency(calcTokenPrice(pool.shortBalance, pool.shortToken.supply))}</TableCell>

                {/** 24H Change */}
                <TableCell>{toApproxCurrency(pool.oraclePrice)}</TableCell>

                {/** 30d Realised APY */}
                <TableCell>{/* <MarketChange marketChange={pool.marketChange} /> */}</TableCell>

                {/** Rebalance Multiplier */}
                <TableCell></TableCell>

                {/** TVL */}
                <TableCell>{toApproxCurrency(pool.shortBalance)}</TableCell>

                {/** My Holdings */}
                <TableCell>{shortToken.balance.toFixed(3)}</TableCell>

                <TableCell>
                    <Link
                        href={{
                            pathname: '/',
                            query: { pool: poolInfo.address, type: MINT, side: SHORT },
                        }}
                    >
                        <StyledButton>Mint</StyledButton>
                    </Link>
                    <Link
                        href={{
                            pathname: '/',
                            query: { pool: poolInfo.address, type: BURN, side: SHORT },
                        }}
                    >
                        <StyledButton>Burn</StyledButton>
                    </Link>
                </TableCell>
            </StyledTableRow>
            <StyledTableRow>
                {/** Token name */}
                <TableCell>{longToken.name}</TableCell>

                {/** Last Price */}
                <TableCell>{toApproxCurrency(calcTokenPrice(pool.longBalance, pool.longToken.supply))}</TableCell>

                {/** 24H Change */}
                <TableCell>{toApproxCurrency(pool.oraclePrice)}</TableCell>

                {/** 30d Realised APY */}
                <TableCell>{/* <MarketChange marketChange={pool.marketChange} /> */}</TableCell>

                {/** Rebalance Multiplier */}
                <TableCell></TableCell>

                {/** TVL */}
                <TableCell>{toApproxCurrency(pool.longBalance)}</TableCell>

                {/** My Holdings */}
                <TableCell>{longToken.balance.toFixed(3)}</TableCell>
                <TableCell>
                    <Link
                        href={{
                            pathname: '/',
                            query: { pool: poolInfo.address, type: MINT, side: LONG },
                        }}
                    >
                        <StyledButton>Mint</StyledButton>
                    </Link>
                    <Link
                        href={{
                            pathname: '/',
                            query: { pool: poolInfo.address, type: BURN, side: LONG },
                        }}
                    >
                        <StyledButton>Burn</StyledButton>
                    </Link>
                </TableCell>
            </StyledTableRow>
        </>
    );
}) as React.FC<{
    poolInfo: PoolType;
}>;

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

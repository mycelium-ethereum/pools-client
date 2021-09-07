import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { toApproxCurrency } from '@libs/utils';
import React from 'react';
import { BrowseTableRowData } from '../state';

export default (({ rows, onClickBuy, onClickSell }) => {
    console.log(rows);
    return (
        <Table>
            <TableHeader>
                <span>Token</span>
                <span>Last Price</span>
                <span>24H Change</span>
                <span>Rebalance Rate</span>
                <span>30D Realised APY</span>
                <span>TVL</span>
                <span>My Holdings</span>
                <span>{/* Empty header for buttons column */}</span>
            </TableHeader>
            {rows.map((pool, index) => {
                const hasHoldings = pool.myHoldings > 0;
                return (
                    <TableRow key={pool.tokenAddress} rowNumber={index}>
                        <span>{formatTokenName(pool)}</span>
                        <span>{toApproxCurrency(pool.lastPrice)}</span>
                        <ColoredChangeNumber number={pool.change24Hours} />
                        <span>{pool.rebalanceRate.toFixed(2)}%</span>
                        <span>{pool.APY30Days.toFixed(2)}%</span>
                        <span>{toApproxCurrency(pool.totalValueLocked)}</span>
                        <span>{toApproxCurrency(pool.myHoldings)}</span>
                        <span>
                            <button
                                className="py-2 px-5 mx-1 bg-indigo-100 font-bold ring-2 rounded-2xl ring-indigo-500 uppercase"
                                onClick={() => onClickBuy(pool.tokenAddress)}
                            >
                                Buy
                            </button>
                            <button
                                className="py-2 px-5 mx-1 bg-indigo-100 font-bold ring-2 rounded-2xl ring-indigo-500 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!hasHoldings}
                                onClick={() => onClickSell(pool.tokenAddress)}
                            >
                                Sell
                            </button>
                        </span>
                    </TableRow>
                );
            })}
        </Table>
    );
}) as React.FC<{
    rows: BrowseTableRowData[];
    onClickBuy: (tokenAddress: string) => void;
    onClickSell: (tokenAddress: string) => void;
}>;

const ColoredChangeNumber = (({ number }) => {
    return (
        <span className={number >= 0 ? 'text-green-500' : 'text-red-500'}>{`${number >= 0 ? '+' : ''}${number.toFixed(
            2,
        )}`}</span>
    );
}) as React.FC<{
    number: number;
}>;

function formatTokenName(pool: BrowseTableRowData) {
    let result = '';
    result += pool.leverage;
    if (pool.side === 'long') result += 'UP-';
    else result += 'DOWN-';
    result += pool.tokenName;
    return result;
}

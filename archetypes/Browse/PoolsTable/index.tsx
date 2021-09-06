import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { toApproxCurrency } from '@libs/utils';
import React from 'react';

export interface PoolRowItem {
    tokenAddress: string;
    tokenName: string;
    lastPrice: number;
    change24Hours: number;
    APY30Days: number;
    rebalanceRate: number;
    totalValueLocked: number;
    myHoldings: number;
}

export default (({ pools, onClickBuy, onClickSell }) => {
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
            {pools.map((pool, index) => (
                <TableRow key={index} rowNumber={index}>
                    <span>{pool.tokenName}</span>
                    <span>{toApproxCurrency(pool.lastPrice)}</span>
                    <ColoredChangeNumber number={pool.change24Hours} />
                    <span>{pool.rebalanceRate.toFixed(2)}%</span>
                    <span>{pool.APY30Days.toFixed(2)}%</span>
                    <span>{toApproxCurrency(pool.totalValueLocked)}</span>
                    <span>{toApproxCurrency(pool.myHoldings)}</span>
                    <span>
                        <button
                            className="py-2 px-5 mx-1 bg-indigo-100 font-bold border-2 rounded-2xl border-indigo-500 uppercase"
                            onClick={() => onClickBuy(pool.tokenAddress)}
                        >
                            Buy
                        </button>
                        <button
                            className="py-2 px-5 mx-1 bg-indigo-100 font-bold border-2 rounded-2xl border-indigo-500 uppercase disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={pool.myHoldings <= 0}
                            onClick={() => onClickSell(pool.tokenAddress)}
                        >
                            Sell
                        </button>
                    </span>
                </TableRow>
            ))}
        </Table>
    );
}) as React.FC<{
    pools: PoolRowItem[];
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

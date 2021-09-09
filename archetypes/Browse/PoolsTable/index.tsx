import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { LONG, SHORT } from '@libs/constants';
import { SideType } from '@libs/types/General';
import { toApproxCurrency } from '@libs/utils/converters';
import React from 'react';
import { BrowseTableRowData } from '../state';

export default (({ rows, onClickBuy, onClickSell }) => {
    console.debug('Browse table rows', rows);
    return (
        <Table>
            <TableHeader>
                <span>Token</span>
                <span>Last Price (USDC)</span>
                <span>24H Change</span>
                <span>Rebalance Rate</span>
                <span>TVL (USDC)</span>
                <span>My Holdings (TOKENS/USDC)</span>
                <span>{/* Empty header for buttons column */}</span>
            </TableHeader>
            {rows.map((token, index) => {
                const hasHoldings = token.myHoldings > 0;
                return (
                    <TableRow key={token.address} rowNumber={index}>
                        <span>{token.symbol}</span>
                        <span>{toApproxCurrency(token.lastPrice)}</span>
                        <ColoredChangeNumber number={token.change24Hours} />
                        <span>{token.rebalanceRate.toFixed(2)}%</span>
                        <span>{toApproxCurrency(token.totalValueLocked)}</span>
                        <span>
                            <div>{`${token.myHoldings}`}</div>
                            <div className="opacity-50">{toApproxCurrency(token.myHoldings * token.lastPrice)}</div>
                        </span>
                        <span>
                            <button
                                className="py-2 px-5 mx-1 bg-indigo-100 font-bold ring-2 rounded-2xl ring-indigo-500 uppercase"
                                onClick={() => onClickBuy(token.pool, token.side === 'short' ? SHORT : LONG)}
                            >
                                Buy
                            </button>
                            <button
                                className="py-2 px-5 mx-1 bg-indigo-100 font-bold ring-2 rounded-2xl ring-indigo-500 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!hasHoldings}
                                onClick={() => onClickSell(token.pool, token.side === 'short' ? SHORT : LONG)}
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
    onClickBuy: (pool: string, side: SideType) => void;
    onClickSell: (pool: string, side: SideType) => void;
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

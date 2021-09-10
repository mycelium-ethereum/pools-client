import Button from '@components/General/Button';
import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { LONG, SHORT } from '@libs/constants';
import { SideType } from '@libs/types/General';
import { toApproxCurrency } from '@libs/utils/converters';
import React from 'react';
import RebalanceRate from '../RebalanceRate';
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
                        <RebalanceRate rebalanceRate={token.rebalanceRate}></RebalanceRate>
                        <span>{toApproxCurrency(token.totalValueLocked)}</span>
                        <span>
                            <div>{`${token.myHoldings}`}</div>
                            <div className="opacity-50">{toApproxCurrency(token.myHoldings * token.lastPrice)}</div>
                        </span>
                        <span>
                            <Button
                                className="mx-1 w-[70px] rounded-2xl font-bold uppercase "
                                size="sm"
                                variant="primary-light"
                                onClick={() => onClickBuy(token.pool, token.side === 'short' ? SHORT : LONG)}
                            >
                                Buy
                            </Button>
                            <Button
                                className="mx-1 w-[70px] rounded-2xl font-bold uppercase "
                                size="sm"
                                variant="primary-light"
                                disabled={!hasHoldings}
                                onClick={() => onClickSell(token.pool, token.side === 'short' ? SHORT : LONG)}
                            >
                                Sell
                            </Button>
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

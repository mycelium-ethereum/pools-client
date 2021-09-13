import React from 'react';
import { BrowseTableRowData } from '../state';
import { Table, TableHeader, TableRow } from '@components/General/TWTable';
// import { LONG, SHORT } from '@libs/constants';
// import { SideType } from '@libs/types/General';
// import { toApproxCurrency } from '@libs/utils/converters';
//TODO: Fill in table with farm column data map token farm pairs, add button functions

//export default (({ rows, onClickStake, onClickUnStake }) => {
export default (({ rows }) => {
    console.debug('Browse table rows', rows);
    return (
        <Table>
            <TableHeader>
                <span>Farm</span>
                <span>APY</span>
                <span>TVL (USDC)</span>
                <span>MY STAKED (Tokens/USDC)</span>
                <span>MY REWARDS (TCR/USDC)</span>
                <span>{/* Empty header for buttons column */}</span>
            </TableHeader>
            {rows.map((farm, index) => {
                //const hasHoldings = token.myHoldings > 0;
                return (
                    <TableRow key={farm.farm} rowNumber={index}>
                        <span>ID:{farm.farm}</span>
                        <span>{farm.APY}%</span>
                        {/* <ColoredChangeNumber number={token.change24Hours} /> */}
                        <span>{farm.TVL}M</span>
                        <span>{farm.myStaked}</span>

                        <span>{farm.myRewards}</span>
                        {/* <span>
                            <div>{`${token.myHoldings}`}</div>
                            <div className="opacity-50">{toApproxCurrency(token.myHoldings * token.lastPrice)}</div>
                        </span> */}
                        <span>
                            <button
                                className="py-2 px-5 mx-1 bg-indigo-100 font-bold ring-2 rounded-2xl ring-indigo-500 uppercase"
                                //onClick={() => onClickStake(token.pool, token.side === 'short' ? SHORT : LONG)}
                            >
                                Stake
                            </button>
                            <button
                                className="py-2 px-5 mx-1 bg-indigo-100 font-bold ring-2 rounded-2xl ring-indigo-500 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                                //disabled={!hasHoldings}
                                //onClick={() => onClickUnStake(token.pool, token.side === 'short' ? SHORT : LONG)}
                            >
                                Unstake
                            </button>
                            <button
                                className="py-2 px-5 mx-1 bg-indigo-100 font-bold ring-2 rounded-2xl ring-indigo-500 uppercase"
                                //onClick={() => onClickBuy(token.pool, token.side === 'short' ? SHORT : LONG)}
                            >
                                Claim
                            </button>
                        </span>
                    </TableRow>
                );
            })}
        </Table>
    );
}) as React.FC<{
    rows: BrowseTableRowData[];
    //onClickStake: (pool: string) => void;
    //onClickUnstake: (pool: string) => void;
}>;

// //const ColoredChangeNumber = (({ number }) => {
//     return (
//         <span className={number >= 0 ? 'text-green-500' : 'text-red-500'}>{`${number >= 0 ? '+' : ''}${number.toFixed(
//             2,
//         )}`}</span>
//     );
// }) as React.FC<{
//     number: number;
// }>;
//TODO: Buttons functionality

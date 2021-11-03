import React, { useMemo } from 'react';
import { Table, TableHeader, TableRow, TableHeaderCell, TableRowCell } from '@components/General/TWTable';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import Loading from '@components/General/Loading';
import { TokenRowProps } from '..';
import { ethers } from 'ethers';
import Actions from '@components/TokenActions';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { toApproxCurrency } from '@libs/utils/converters';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';

export default (({ rows }) => {
    const { provider } = useWeb3();

    return (
        <>
            <Table>
                <TableHeader>
                    <TableHeaderCell>Token</TableHeaderCell>
                    <TableHeaderCell>Holdings (Tokens)</TableHeaderCell>
                    <TableHeaderCell>Last Price (USDC)</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap">Net Value (USDC)</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap">Deposits (USDC)</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap">Profits And Losses</TableHeaderCell>
                    <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                </TableHeader>
                {rows.map((token, index) => {
                    return <TokenRow {...token} index={index} key={token.token.address} provider={provider ?? null} />;
                })}
            </Table>
            {!rows.length ? <Loading className="w-10 mx-auto my-8" /> : null}
        </>
    );
}) as React.FC<{
    rows: TokenRowProps[];
}>;

export const TokenRow: React.FC<
    TokenRowProps & {
        provider: ethers.providers.JsonRpcProvider | null;
        index: number;
    }
> = ({ token, price, holdings, provider, deposits, index }) => {
    const netValue = useMemo(() => holdings.times(price), [holdings, price]);
    const pnl = useMemo(() => netValue.minus(deposits), [netValue, deposits]);

    return (
        <TableRow rowNumber={index}>
            <TableRowCell>
                <Logo ticker={tokenSymbolToLogoTicker(token.symbol)} className="inline mr-2" />
                {token.name}
            </TableRowCell>
            <TableRowCell>{holdings.toFixed(2)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(price)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(netValue)}</TableRowCell>
            <TableRowCell>{toApproxCurrency(deposits)}</TableRowCell>
            <TableRowCell className={pnl.gt(0) ? 'text-green-500' : 'text-red-500'}>
                {toApproxCurrency(pnl)}
            </TableRowCell>
            <TableRowCell className="flex text-right">
                <Actions
                    token={token}
                    provider={provider}
                    arbiscanTarget={{
                        type: ArbiscanEnum.token,
                        target: token.address,
                    }}
                />
            </TableRowCell>
        </TableRow>
    );
};

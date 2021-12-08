import React, { useMemo } from 'react';
import { Table, TableHeader, TableRow, TableHeaderCell, TableRowCell } from '@components/General/TWTable';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import Loading from '@components/General/Loading';
import { TokenRowProps } from '..';
import { ethers } from 'ethers';
import Actions from '@components/TokenActions';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { tickerToName, toApproxCurrency } from '@libs/utils/converters';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import Button from '@components/General/Button';

export default (({ rows }) => {
    const { provider } = useWeb3();

    return (
        <>
            <Table>
                <TableHeader>
                    <TableHeaderCell>Token</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap">Token Valuation</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap">Acquisition Cost</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap">Unrealised PnL</TableHeaderCell>
                    <TableHeaderCell className="whitespace-nowrap">Notional Value</TableHeaderCell>
                    <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                </TableHeader>
                {rows.map((token, index) => {
                    return <TokenRow {...token} index={index} key={token.address} provider={provider ?? null} />;
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
> = ({ symbol, name, address, decimals, price, holdings, provider, deposits, index }) => {
    const netValue = useMemo(() => holdings.times(price), [holdings, price]);
    const pnl = useMemo(() => netValue.minus(deposits), [netValue, deposits]);

    return (
        <TableRow rowNumber={index}>
            <TableRowCell>
                <div className="flex">
                    <Logo ticker={tokenSymbolToLogoTicker(symbol)} size="md" className="inline mr-2 my-auto" />
                    <div className="my-auto">
                        <div className="font-bold">{tickerToName(name)}</div>
                        <div className="text-xs">{name.split('-')[1]}</div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>{toApproxCurrency(netValue)}</div>
                <div className="opacity-80">{holdings.toFixed(2)} tokens</div>
            </TableRowCell>
            <TableRowCell>
                <div>{toApproxCurrency(deposits)}</div>
                <div className="opacity-80">{holdings.toFixed(2)} tokens</div>
            </TableRowCell>
            <TableRowCell className={pnl.gt(0) ? 'text-green-500' : 'text-red-500'}>
                {toApproxCurrency(pnl)}
            </TableRowCell>
            <TableRowCell>{/*Notional Value Cell*/}</TableRowCell>
            <TableRowCell className="flex">
                <Button
                    className="mx-1 w-[70px] my-auto ml-auto font-bold uppercase "
                    size="xs"
                    variant="primary-light"
                >
                    Stake
                </Button>
                <Button className="mx-1 w-[70px] my-auto font-bold uppercase " size="xs" variant="primary-light">
                    Burn
                </Button>
                <Actions
                    token={{
                        address,
                        symbol,
                        decimals,
                    }}
                    provider={provider}
                    arbiscanTarget={{
                        type: ArbiscanEnum.token,
                        target: address,
                    }}
                />
            </TableRowCell>
        </TableRow>
    );
};

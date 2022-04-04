import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { CommitActionEnum, SideEnum } from '@tracer-protocol/pools-js';
import { Logo, tokenSymbolToLogoTicker } from '~/components/General';
import Button from '~/components/General/Button';
import Loading from '~/components/General/Loading';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '~/components/General/TWTable';
import Actions from '~/components/TokenActions';
import { useStore } from '~/store/main';
import { selectProvider } from '~/store/Web3Slice';
import { BlockExplorerAddressType } from '~/types/blockExplorers';
import { toApproxCurrency } from '~/utils/converters';
import { DenotedInEnum, TokenRowProps } from '../state';

export default (({ rows, onClickCommitAction, denotedIn }) => {
    const provider = useStore(selectProvider);

    return (
        <>
            <Table>
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Token</TableHeaderCell>
                        <TableHeaderCell className="whitespace-nowrap">Token Valuation</TableHeaderCell>
                        {/*<TableHeaderCell className="whitespace-nowrap">Acquisition Cost</TableHeaderCell>*/}
                        {/*<TableHeaderCell className="whitespace-nowrap">Unrealised PnL</TableHeaderCell>*/}
                        <TableHeaderCell className="whitespace-nowrap">Notional Value</TableHeaderCell>
                        <TableHeaderCell>{/* Empty header for buttons column */}</TableHeaderCell>
                    </tr>
                </TableHeader>
                <tbody>
                    {rows.map((token) => {
                        if (!token.holdings.eq(0)) {
                            return (
                                <TokenRow
                                    {...token}
                                    key={token.address}
                                    provider={provider ?? null}
                                    onClickCommitAction={onClickCommitAction}
                                    denotedIn={denotedIn}
                                />
                            );
                        }
                    })}
                </tbody>
            </Table>
            {!rows.length ? <Loading className="w-10 mx-auto my-8" /> : null}
        </>
    );
}) as React.FC<{
    rows: TokenRowProps[];
    onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
    denotedIn: DenotedInEnum;
}>;

export const TokenRow: React.FC<
    TokenRowProps & {
        onClickCommitAction: (pool: string, side: SideEnum, action: CommitActionEnum) => void;
        provider: ethers.providers.JsonRpcProvider | null;
        denotedIn: DenotedInEnum;
    }
> = ({
    symbol,
    name,
    address,
    poolAddress,
    decimals,
    side,
    price,
    holdings,
    provider,
    // deposits,
    onClickCommitAction,
    oraclePrice,
    denotedIn,
}) => {
    const router = useRouter();
    const netValue = useMemo(() => holdings.times(price), [holdings, price]);
    // const pnl = useMemo(() => netValue.minus(deposits), [netValue, deposits]);

    const BaseNumDenote = (netValue: BigNumber, oraclePrice: BigNumber, name: string, leverage?: number) => {
        if (netValue.eq(0)) {
            return netValue.toFixed(2);
        } else if (name.split('-')[1].split('/')[0] === 'BTC') {
            return leverage
                ? ((netValue.toNumber() / oraclePrice.toNumber()) * leverage).toFixed(8)
                : (netValue.toNumber() / oraclePrice.toNumber()).toFixed(8);
        } else if (name.split('-')[1].split('/')[0] === 'ETH') {
            return leverage
                ? ((netValue.toNumber() / oraclePrice.toNumber()) * leverage).toFixed(6)
                : (netValue.toNumber() / oraclePrice.toNumber()).toFixed(6);
        }
    };

    const NotionalDenote = (netValue: BigNumber, leverage?: number) => {
        return leverage ? toApproxCurrency(netValue.toNumber() * leverage) : toApproxCurrency(netValue);
    };

    return (
        <TableRow lined>
            <TableRowCell>
                {/*<div className="flex">*/}
                {/*    <Logo ticker={tokenSymbolToLogoTicker(symbol)} size="md" className="inline mr-2 my-auto" />*/}
                {/*    <div className="my-auto">*/}
                {/*        <div className="font-bold">{tickerToName(name)}</div>*/}
                {/*        <div className="text-xs">{name.split('-')[1]}</div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="flex my-auto">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(symbol)} className="inline my-auto mr-2" />
                    <div>
                        <div className="flex">
                            <div>
                                {symbol.split('-')[0][0]}-
                                {symbol.split('-')[1].split('/')[0] === 'BTC' ? 'Bitcoin' : 'Ethereum'}
                            </div>
                            &nbsp;
                            <div className={`${side === SideEnum.long ? 'green' : 'red'}`}>
                                {side === SideEnum.long ? 'Long' : 'Short'}
                            </div>
                        </div>
                        <div className="text-cool-gray-500">{name} </div>
                    </div>
                </div>
            </TableRowCell>
            <TableRowCell>
                <div>
                    {
                        denotedIn === DenotedInEnum.BASE ? (
                            <>
                                {BaseNumDenote(netValue, oraclePrice, name)} {name.split('-')[1].split('/')[0]}
                            </>
                        ) : (
                            `${toApproxCurrency(netValue)} USD`
                        )
                        // TODO the above netValue is fine for stable coins but needs a conversion
                        //  rate for anything that is not 1/1 with USD
                    }
                </div>
                <div className="opacity-80">{holdings.toFixed(2)} tokens</div>
            </TableRowCell>
            {/*<TableRowCell>*/}
            {/*    <div>{toApproxCurrency(deposits)}</div>*/}
            {/*    <div className="opacity-80">{holdings.toFixed(2)} tokens</div>*/}
            {/*</TableRowCell>*/}
            {/*<TableRowCell className={pnl.gt(0) ? 'text-green-500' : 'text-red-500'}>*/}
            {/*    {toApproxCurrency(pnl)}*/}
            {/*</TableRowCell>*/}
            <TableRowCell>
                {denotedIn === DenotedInEnum.BASE ? (
                    <>
                        {BaseNumDenote(netValue, oraclePrice, name, parseInt(name.split('-')[0][0]))}{' '}
                        {name.split('-')[1].split('/')[0]}
                    </>
                ) : (
                    `${NotionalDenote(netValue, parseInt(name.split('-')[0][0]))} USD`
                )}
            </TableRowCell>
            <TableRowCell className="flex">
                <Button
                    className="mx-1 w-[70px] my-auto ml-auto uppercase border-0 py-2"
                    size="xs"
                    variant="primary-light"
                    disabled={!netValue.toNumber()}
                    onClick={() => {
                        router.push('/stakepooltoken');
                        sessionStorage.setItem('portfolio.selectedToken', address);
                    }}
                >
                    Stake
                </Button>
                <Button
                    className="mx-1 w-[70px] my-auto uppercase border-0 py-2"
                    size="xs"
                    variant="primary-light"
                    disabled={!netValue.toNumber()}
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.burn)}
                >
                    Burn
                </Button>
                <Button
                    className="mx-1 w-[70px] my-auto uppercase border-0 py-2"
                    size="xs"
                    variant="primary-light"
                    disabled={!netValue.toNumber()}
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.flip)}
                >
                    Flip
                </Button>
                <Actions
                    token={{
                        address,
                        symbol,
                        decimals,
                    }}
                    provider={provider}
                    arbiscanTarget={{
                        type: BlockExplorerAddressType.token,
                        target: address,
                    }}
                />
            </TableRowCell>
        </TableRow>
    );
};

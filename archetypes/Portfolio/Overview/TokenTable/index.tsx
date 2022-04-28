import React, { useMemo } from 'react';
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
import { getBaseAssetFromMarket } from '~/utils/poolNames';
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
            {!rows.length ? <Loading className="mx-auto my-8 w-10" /> : null}
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
    marketInfo,
    address,
    poolAddress,
    decimals,
    side,
    price,
    holdings,
    provider,
    onClickCommitAction,
    oraclePrice,
    denotedIn,
}) => {
    const netValue = useMemo(() => holdings.times(price), [holdings, price]);

    const marketBase = getBaseAssetFromMarket(marketInfo.marketSymbol);

    const BaseNumDenote = (netValue: BigNumber, oraclePrice: BigNumber, leverage?: number) => {
        if (netValue.eq(0)) {
            return netValue.toFixed(2);
        } else if (marketBase === 'BTC') {
            return leverage
                ? ((netValue.toNumber() / oraclePrice.toNumber()) * leverage).toFixed(8)
                : (netValue.toNumber() / oraclePrice.toNumber()).toFixed(8);
        } else if (marketBase === 'ETH') {
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
                <div className="my-auto flex">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(symbol)} className="my-auto mr-2 inline" />
                    <div>
                        <div className="flex">
                            <div>
                                {marketInfo.leverage}-{marketInfo.marketName}
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
                                {BaseNumDenote(netValue, oraclePrice)} {marketBase}
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
            <TableRowCell>
                {denotedIn === DenotedInEnum.BASE ? (
                    <>
                        {BaseNumDenote(netValue, oraclePrice, marketInfo.leverage)} {marketBase}
                    </>
                ) : (
                    `${NotionalDenote(netValue, marketInfo.leverage)} USD`
                )}
            </TableRowCell>
            <TableRowCell className="flex">
                <Button
                    className="mx-1 my-auto w-[70px] border-0 py-2 uppercase"
                    size="xs"
                    variant="primary-light"
                    disabled={!netValue.toNumber()}
                    onClick={() => onClickCommitAction(poolAddress, side, CommitActionEnum.burn)}
                >
                    Burn
                </Button>
                <Button
                    className="mx-1 my-auto w-[70px] border-0 py-2 uppercase"
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

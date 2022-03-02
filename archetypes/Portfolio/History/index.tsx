import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ARBITRUM, CommitActionEnum, CommitActionToQueryFocusMap } from '@libs/constants';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '@components/General/TWTable';
import Pagination, { PageNumber } from '@components/General/Pagination';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { marketSymbolToAssetName, toApproxCurrency } from '@libs/utils/converters';
import usePagination, { PAGE_ENTRIES } from '@libs/hooks/usePagination';
import fetchTradeHistory, { COMMIT_TYPES_V2, TradeHistory } from '@libs/utils/tradeHistoryAPI';
import TWButtonGroup from '@components/General/TWButtonGroup';
import Loading from '@components/General/Loading';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import Actions from '@components/TokenActions';

import NoQueued from '@public/img/no-queued.svg';
import { SourceType } from '@libs/utils/reputationAPI';

const historyOptions = [
    {
        key: CommitActionEnum.mint,
        text: 'Mint History',
    },
    {
        key: CommitActionEnum.burn,
        text: 'Burn History',
    },
    {
        key: CommitActionEnum.flip,
        text: 'Flip History',
    },
];

export default (({ focus }) => {
    const [loading, setLoading] = useState(false);
    const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const router = useRouter();
    const { provider, account, network } = useWeb3();
    const { setPage, page } = usePagination(tradeHistory);

    useEffect(() => {
        setLoading(true);
        if (account) {
            fetchTradeHistory({
                account: account ?? '0',
                network: (network as SourceType) ?? ARBITRUM,
                type: CommitActionToQueryFocusMap[focus as CommitActionEnum],
                page,
                pageSize: PAGE_ENTRIES, // TODO: allow user to choose results per page
            }).then((r) => {
                setLoading(false);
                setTradeHistory(r.results);
                setTotalRecords(r.totalRecords);
            });
        }
    }, [focus, page, account, network]);

    const HistoryTableHeader = (focus: CommitActionEnum) => {
        if (focus === CommitActionEnum.mint) {
            return (
                <TableHeader>
                    <TableHeaderCell>Time / Date</TableHeaderCell>
                    <TableHeaderCell>Token</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>Tokens / Price</TableHeaderCell>
                    <TableHeaderCell>Protocol Fee</TableHeaderCell>
                    <TableHeaderCell />
                </TableHeader>
            );
        } else if (focus === CommitActionEnum.burn) {
            return (
                <TableHeader>
                    <TableHeaderCell>Time / Date</TableHeaderCell>
                    <TableHeaderCell>Token</TableHeaderCell>
                    <TableHeaderCell>Amount / Price</TableHeaderCell>
                    <TableHeaderCell>Return</TableHeaderCell>
                    <TableHeaderCell>Fee</TableHeaderCell>
                    <TableHeaderCell />
                </TableHeader>
            );
        } else if (focus === CommitActionEnum.flip) {
            return (
                <TableHeader>
                    <tr>
                        <TableHeaderCell>Time / Date</TableHeaderCell>
                        <TableHeaderCell>From</TableHeaderCell>
                        <TableHeaderCell />
                        <TableHeaderCell>To</TableHeaderCell>
                        <TableHeaderCell />
                        <TableHeaderCell>Fee</TableHeaderCell>
                        <TableHeaderCell />
                    </tr>
                    <tr>
                        <TableHeaderCell />
                        <TableHeaderCell>Token / Price</TableHeaderCell>
                        <TableHeaderCell>Amount</TableHeaderCell>
                        <TableHeaderCell>Token / Price</TableHeaderCell>
                        <TableHeaderCell>Amount</TableHeaderCell>
                        <TableHeaderCell />
                        <TableHeaderCell />
                    </tr>
                </TableHeader>
            );
        }
    };

    return (
        <div className="bg-theme-background rounded-xl shadow mt-5 p-5">
            <div className="mb-5">
                <TWButtonGroup
                    value={focus}
                    size="lg"
                    onClick={(option) =>
                        router.push({
                            query: {
                                focus: CommitActionToQueryFocusMap[option as CommitActionEnum],
                            },
                        })
                    }
                    color="tracer"
                    options={historyOptions}
                />
            </div>
            <Table>
                {HistoryTableHeader(focus)}
                {loading ? (
                    <tr>
                        <td colSpan={5}>
                            <div className="my-20 text-center">
                                <Loading className="w-10 mx-auto my-8" />
                            </div>
                        </td>
                    </tr>
                ) : (
                    <tbody>
                        {tradeHistory.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className="my-20 text-center">
                                        <NoQueued className="mx-auto mb-5" />
                                        <div className="text-cool-gray-500">
                                            You have no {router.query.focus} history.
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            tradeHistory.map((commit, index) => (
                                <CommitRow key={`pcr-${index}`} index={index} {...commit} provider={provider} />
                            ))
                        )}
                    </tbody>
                )}
            </Table>
            <div className="ml-auto mt-auto px-4 sm:px-6 py-3">
                <PageNumber page={page} numResults={totalRecords} resultsPerPage={PAGE_ENTRIES} />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Pagination
                        onLeft={({ nextPage }) => {
                            setPage(nextPage);
                        }}
                        onRight={({ nextPage }) => {
                            setPage(nextPage);
                        }}
                        onDirect={({ nextPage }) => {
                            setPage(nextPage);
                        }}
                        numPages={Math.ceil(totalRecords / PAGE_ENTRIES) || 1}
                        selectedPage={page}
                    />
                </div>
            </div>
        </div>
    );
}) as React.FC<{
    focus: CommitActionEnum;
}>;

const CommitRow: React.FC<
    TradeHistory & {
        index: number;
        provider?: ethers.providers.JsonRpcProvider;
    }
> = ({
    date,
    tokenInAmount,
    tokenOutAmount,
    price,
    fee,
    tokenInSymbol,
    tokenOutSymbol,
    index,
    type,
    provider,
    tokenInAddress,
    tokenOutAddress,
    tokenDecimals,
    transactionHashIn,
    transactionHashOut,
    priceTokenSymbol,
}) => {
    const timeString = new Intl.DateTimeFormat('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
    }).format(new Date(date * 1000));
    const dateString = new Intl.DateTimeFormat('en-AU').format(new Date(date * 1000));

    const HistoryTableRow = () => {
        if (type === COMMIT_TYPES_V2.LONG_MINT || type === COMMIT_TYPES_V2.SHORT_MINT) {
            return (
                <TableRow key={index} rowNumber={index}>
                    {/*Time / Date*/}
                    <TableRowCell>
                        <div>{timeString}</div>
                        <div className="text-cool-gray-500">{dateString}</div>
                    </TableRowCell>
                    {/*Token*/}
                    <TableRowCell>
                        <div className="flex my-auto">
                            <Logo
                                size="lg"
                                ticker={tokenSymbolToLogoTicker(tokenOutSymbol)}
                                className="inline my-auto mr-2"
                            />
                            <div>
                                <div className="flex">
                                    <div>
                                        {tokenOutSymbol.split('-')[0][0]}-
                                        {marketSymbolToAssetName[tokenOutSymbol.slice(3)]}
                                    </div>
                                    &nbsp;
                                    <div className={type === COMMIT_TYPES_V2.LONG_MINT ? 'green' : 'red'}>
                                        {type === COMMIT_TYPES_V2.LONG_MINT ? 'Long' : 'Short'}
                                    </div>
                                </div>
                                {tokenOutSymbol}
                            </div>
                        </div>
                    </TableRowCell>
                    {/*Amount*/}
                    <TableRowCell>
                        {toApproxCurrency(
                            (price.toNumber() / 10 ** tokenDecimals) * (tokenInAmount.toNumber() / 10 ** tokenDecimals),
                        )}
                    </TableRowCell>
                    {/*Tokens / Price*/}
                    <TableRowCell>
                        <div>{(tokenInAmount.toNumber() / 10 ** tokenDecimals).toFixed(2)} tokens</div>
                        <div className="text-cool-gray-500">
                            at {toApproxCurrency(price.toNumber() / 10 ** tokenDecimals)} {priceTokenSymbol}/token
                        </div>
                    </TableRowCell>
                    {/*Protocol Fee*/}
                    <TableRowCell>
                        {toApproxCurrency(fee.toNumber() / 10 ** tokenDecimals)} {priceTokenSymbol}
                    </TableRowCell>
                    <TableRowCell>
                        <Actions
                            provider={provider as ethers.providers.JsonRpcProvider}
                            token={{
                                address: tokenOutAddress,
                                decimals: tokenDecimals,
                                symbol: tokenOutSymbol,
                            }}
                            arbiscanTarget={{
                                type: ArbiscanEnum.token,
                                target: tokenOutAddress,
                            }}
                            otherActions={[
                                {
                                    type: ArbiscanEnum.txn,
                                    target: transactionHashIn,
                                    logo: ARBITRUM,
                                    text: 'View Commit on Arbiscan',
                                },
                                {
                                    type: ArbiscanEnum.txn,
                                    target: transactionHashOut,
                                    logo: ARBITRUM,
                                    text: 'View Upkeep on Arbiscan',
                                },
                            ]}
                        />
                    </TableRowCell>
                </TableRow>
            );
        } else if (type === COMMIT_TYPES_V2.LONG_BURN || type === COMMIT_TYPES_V2.SHORT_BURN) {
            return (
                <TableRow key={index} rowNumber={index}>
                    <TableRowCell>
                        <div>{timeString}</div>
                        <div className="text-cool-gray-500">{dateString}</div>
                    </TableRowCell>
                    <TableRowCell>
                        <div className="flex my-auto">
                            <Logo
                                size="lg"
                                ticker={tokenSymbolToLogoTicker(tokenInSymbol)}
                                className="inline my-auto mr-2"
                            />
                            <div>
                                <div className="flex">
                                    <div>
                                        {tokenInSymbol.split('-')[0][0]}-
                                        {marketSymbolToAssetName[tokenInSymbol.slice(3)]}
                                    </div>
                                    &nbsp;
                                    <div className={type === COMMIT_TYPES_V2.LONG_BURN ? 'green' : 'red'}>
                                        {type === COMMIT_TYPES_V2.LONG_BURN ? 'Long' : 'Short'}
                                    </div>
                                </div>
                                {tokenInSymbol}
                            </div>
                        </div>
                    </TableRowCell>
                    <TableRowCell>
                        <div>{(tokenInAmount.toNumber() / 10 ** tokenDecimals).toFixed(2)} tokens</div>
                        <div className="text-cool-gray-500">
                            at {toApproxCurrency(price.toNumber() / 10 ** tokenDecimals)} {priceTokenSymbol}/token
                        </div>
                    </TableRowCell>
                    <TableRowCell>
                        {toApproxCurrency(
                            (price.toNumber() / 10 ** tokenDecimals) * (tokenInAmount.toNumber() / 10 ** tokenDecimals),
                        )}
                    </TableRowCell>
                    <TableRowCell>
                        {toApproxCurrency(fee.toNumber() / 10 ** tokenDecimals)} {priceTokenSymbol}
                    </TableRowCell>
                    <TableRowCell>
                        <Actions
                            provider={provider as ethers.providers.JsonRpcProvider}
                            token={{
                                address: tokenInAddress,
                                decimals: tokenDecimals,
                                symbol: tokenInSymbol,
                            }}
                            arbiscanTarget={{
                                type: ArbiscanEnum.token,
                                target: tokenInAddress,
                            }}
                            otherActions={[
                                {
                                    type: ArbiscanEnum.txn,
                                    target: transactionHashIn,
                                    logo: ARBITRUM,
                                    text: 'View Commit on Arbiscan',
                                },
                                {
                                    type: ArbiscanEnum.txn,
                                    target: transactionHashOut,
                                    logo: ARBITRUM,
                                    text: 'View Upkeep on Arbiscan',
                                },
                            ]}
                        />
                    </TableRowCell>
                </TableRow>
            );
        } else if (type === COMMIT_TYPES_V2.LONG_BURN_SHORT_MINT || type === COMMIT_TYPES_V2.SHORT_BURN_LONG_MINT) {
            return (
                <TableRow key={index} rowNumber={index}>
                    <TableRowCell>
                        <div>{timeString}</div>
                        <div className="text-cool-gray-500">{dateString}</div>
                    </TableRowCell>
                    <TableRowCell>
                        <div className="flex my-auto">
                            <Logo
                                size="lg"
                                ticker={tokenSymbolToLogoTicker(tokenInSymbol)}
                                className="inline my-auto mr-2"
                            />
                            <div>
                                <div>{tokenInSymbol}</div>
                                <div className="text-cool-gray-500">
                                    {toApproxCurrency(price.toNumber() / 10 ** tokenDecimals)}
                                </div>
                            </div>
                        </div>
                    </TableRowCell>
                    <TableRowCell>
                        <div>{(tokenInAmount.toNumber() / 10 ** tokenDecimals).toFixed(2)} tokens</div>
                        <div className="text-cool-gray-500">
                            {toApproxCurrency(
                                (price.toNumber() / 10 ** tokenDecimals) *
                                    (tokenInAmount.toNumber() / 10 ** tokenDecimals),
                            )}{' '}
                            {priceTokenSymbol}
                        </div>
                    </TableRowCell>
                    <TableRowCell>
                        <div className="flex my-auto">
                            <Logo
                                size="lg"
                                ticker={tokenSymbolToLogoTicker(tokenOutSymbol)}
                                className="inline my-auto mr-2"
                            />
                            <div>
                                <div>{tokenOutSymbol}</div>
                                <div className="text-cool-gray-500">
                                    {toApproxCurrency(price.toNumber() / 10 ** tokenDecimals)}
                                </div>
                            </div>
                        </div>
                    </TableRowCell>
                    <TableRowCell>
                        <div>{(tokenOutAmount.toNumber() / 10 ** tokenDecimals).toFixed(2)} tokens</div>
                        <div className="text-cool-gray-500">
                            {toApproxCurrency(
                                (price.toNumber() / 10 ** tokenDecimals) *
                                    (tokenOutAmount.toNumber() / 10 ** tokenDecimals),
                            )}{' '}
                            {priceTokenSymbol}
                        </div>
                    </TableRowCell>
                    <TableRowCell>
                        {toApproxCurrency(fee.toNumber() / 10 ** tokenDecimals)} {priceTokenSymbol}
                    </TableRowCell>
                    <TableRowCell>
                        <Actions
                            provider={provider as ethers.providers.JsonRpcProvider}
                            token={{
                                address: tokenInAddress,
                                decimals: tokenDecimals,
                                symbol: tokenInSymbol,
                            }}
                            arbiscanTarget={{
                                type: ArbiscanEnum.token,
                                target: tokenInAddress,
                            }}
                            otherActions={[
                                {
                                    type: ArbiscanEnum.txn,
                                    target: transactionHashIn,
                                    logo: ARBITRUM,
                                    text: 'View Commit on Arbiscan',
                                },
                                {
                                    type: ArbiscanEnum.txn,
                                    target: transactionHashOut,
                                    logo: ARBITRUM,
                                    text: 'View Upkeep on Arbiscan',
                                },
                            ]}
                        />
                    </TableRowCell>
                </TableRow>
            );
        }
    };

    return <>{HistoryTableRow()}</>;
};

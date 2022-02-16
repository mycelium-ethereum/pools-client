import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ARBITRUM, CommitActionEnum, CommitToQueryFocusMap } from '@libs/constants';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { Table, TableHeader, TableRow, TableHeaderCell, TableRowCell } from '@components/General/TWTable';
import Pagination, { PageNumber } from '@components/General/Pagination';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { toApproxCurrency } from '@libs/utils/converters';
import usePagination, { PAGE_ENTRIES } from '@libs/hooks/usePagination';
import fetchTradeHistory, { TradeHistory } from '@libs/utils/tradeHistoryAPI';
import TWButtonGroup from '@components/General/TWButtonGroup';
import Loading from '@components/General/Loading';
import { marketSymbolToAssetName } from '@libs/utils/converters';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';
import Actions from '@components/TokenActions';

import NoQueued from '@public/img/no-queued.svg';
import { SourceType } from '@libs/utils/reputationAPI';
import BigNumber from 'bignumber.js';

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
    const router = useRouter();
    const { provider, account, network } = useWeb3();
    const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const { setPage, page } = usePagination(tradeHistory);

    useEffect(() => {
        setLoading(true);
        if (account) {
            fetchTradeHistory({
                account: account ?? '0',
                network: (network as SourceType) ?? ARBITRUM,
                type: CommitToQueryFocusMap[focus as CommitActionEnum],
                page,
                pageSize: PAGE_ENTRIES, // TODO: allow user to choose results per page
            }).then((r) => {
                setLoading(false);
                setTradeHistory(r.results);
                setTotalRecords(r.totalRecords);
            });
        }
    }, [focus, page, account, network]);

    const isMintHistory = focus === CommitActionEnum.mint;

    return (
        <div className="bg-theme-background rounded-xl shadow mt-5 p-5">
            <div className="mb-5">
                <TWButtonGroup
                    value={focus}
                    size="lg"
                    onClick={(option) =>
                        router.push({
                            query: {
                                focus: CommitToQueryFocusMap[option as CommitActionEnum],
                            },
                        })
                    }
                    color={'tracer'}
                    options={historyOptions}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableHeaderCell>Time / Date</TableHeaderCell>
                    <TableHeaderCell>Token</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>{isMintHistory ? 'Price' : 'Return'}</TableHeaderCell>
                    <TableHeaderCell>{/* Empty header for buttons column *!/ */}</TableHeaderCell>
                </TableHeader>
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
                                        <div className="text-cool-gray-500">You have no history.</div>
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
    price,
    tokenOutSymbol,
    index,
    type,
    provider,
    tokenOutAddress,
    tokenDecimals,
    transactionHashIn,
    transactionHashOut,
}) => {
    const timeString = new Intl.DateTimeFormat('en-AU', {
        hour: 'numeric',
        minute: 'numeric',
    }).format(new Date(date * 1000));
    const dateString = new Intl.DateTimeFormat('en-AU').format(new Date(date * 1000));
    return (
        <TableRow key={index} rowNumber={index}>
            <TableRowCell>
                <div>{timeString}</div>
                <div className="text-cool-gray-500">{dateString}</div>
            </TableRowCell>
            <TableRowCell>
                <div className="flex my-auto">
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenOutSymbol)} className="inline my-auto mr-2" />
                    <div>
                        <div className="flex">
                            <div>
                                {tokenOutSymbol.split('-')[0][0]}-{marketSymbolToAssetName[tokenOutSymbol.slice(3)]}
                            </div>
                            &nbsp;
                            <div className={type === 'LongMint' || type === 'LongBurn' ? 'green' : 'red'}>
                                {type === 'LongMint' || type === 'LongBurn' ? 'Long' : 'Short'}
                            </div>
                        </div>
                        {tokenOutSymbol}
                    </div>
                </div>
            </TableRowCell>
            {type === 'LongBurn' || type === 'ShortBurn' ? (
                <>
                    <TableRowCell>{(+ethers.utils.formatEther(tokenInAmount)).toFixed(2)} tokens</TableRowCell>
                    <TableRowCell>
                        {toApproxCurrency(
                            new BigNumber(ethers.utils.formatEther(price)).times(
                                new BigNumber(ethers.utils.formatEther(tokenInAmount)),
                            ),
                        )}
                    </TableRowCell>
                </>
            ) : (
                <>
                    <TableRowCell>{(+ethers.utils.formatEther(tokenInAmount)).toFixed(2)} tokens</TableRowCell>
                    <TableRowCell>{toApproxCurrency(new BigNumber(ethers.utils.formatEther(price)))}</TableRowCell>
                </>
            )}
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
};

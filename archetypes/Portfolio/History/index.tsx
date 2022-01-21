import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ARBITRUM, CommitsFocusEnum } from '@libs/constants';
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

const historyOptions = [
    {
        key: CommitsFocusEnum.mints,
        text: 'Mint History',
    },
    {
        key: CommitsFocusEnum.burns,
        text: 'Burn History',
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
                type: focus === CommitsFocusEnum.mints ? 'mint' : 'burn',
                page,
                pageSize: PAGE_ENTRIES, // TODO: allow user to choose results per page
            }).then((r) => {
                setLoading(false);
                setTradeHistory(r.results);
                setTotalRecords(r.totalRecords);
            });
        }
    }, [focus, page, account, network]);

    const isMintHistory = focus === CommitsFocusEnum.mints;

    return (
        <div className="bg-theme-background rounded-xl shadow mt-5 p-5">
            <div className="mb-5">
                <TWButtonGroup
                    value={focus}
                    size="lg"
                    onClick={(option) =>
                        router.push({
                            query: {
                                focus: option === CommitsFocusEnum.mints ? 'mints' : 'burns',
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
                    <TableHeaderCell>{isMintHistory ? 'Amount' : 'Amount / Price'}</TableHeaderCell>
                    <TableHeaderCell>{isMintHistory ? 'Tokens / Price' : 'Return'}</TableHeaderCell>
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
                                        <div className="text-cool-gray-500">
                                            You have no {isMintHistory ? 'mint' : 'burn'} history.
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
    focus: CommitsFocusEnum;
}>;

const CommitRow: React.FC<
    TradeHistory & {
        index: number;
        provider?: ethers.providers.JsonRpcProvider;
    }
> = ({
    date,
    tokenAmount,
    tokenPrice,
    tokenSymbol,
    index,
    type,
    provider,
    tokenAddress,
    tokenDecimals,
    collateralAmount,
    collateralSymbol,
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
                    <Logo size="lg" ticker={tokenSymbolToLogoTicker(tokenSymbol)} className="inline my-auto mr-2" />
                    <div>
                        <div className="flex">
                            <div>
                                {tokenSymbol.split('-')[0][0]}-{marketSymbolToAssetName[tokenSymbol.slice(3)]}
                            </div>
                            &nbsp;
                            <div className={type === 'LongMint' || type === 'LongBurn' ? 'green' : 'red'}>
                                {type === 'LongMint' || type === 'LongBurn' ? 'Long' : 'Short'}
                            </div>
                        </div>
                        {tokenSymbol}
                    </div>
                </div>
            </TableRowCell>
            {type === 'LongBurn' || type === 'ShortBurn' ? (
                <>
                    <TableRowCell>
                        <div>{tokenAmount.toFixed(2)} tokens</div>
                        <div className="text-cool-gray-500">
                            at {toApproxCurrency(tokenPrice)} {collateralSymbol}/token
                        </div>
                    </TableRowCell>
                    <TableRowCell>
                        {toApproxCurrency(collateralAmount)} {collateralSymbol}
                    </TableRowCell>
                </>
            ) : (
                <>
                    <TableRowCell>
                        {toApproxCurrency(collateralAmount)} {collateralSymbol}
                    </TableRowCell>
                    <TableRowCell>
                        <div>{tokenAmount.toFixed(2)} tokens</div>
                        <div className="text-cool-gray-500">
                            at {toApproxCurrency(tokenPrice)} {collateralSymbol}/token
                        </div>
                    </TableRowCell>
                </>
            )}
            <TableRowCell>
                <Actions
                    provider={provider as ethers.providers.JsonRpcProvider}
                    token={{
                        address: tokenAddress,
                        decimals: tokenDecimals,
                        symbol: tokenSymbol,
                    }}
                    arbiscanTarget={{
                        type: ArbiscanEnum.token,
                        target: tokenAddress,
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

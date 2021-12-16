import React, { useEffect, useMemo, useState } from 'react';
import { CommitEnum, CommitsFocusEnum } from '@libs/constants';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell } from '@components/General/TWTable';
import Pagination, { PageNumber } from '@components/General/Pagination';
import { Logo, tokenSymbolToLogoTicker } from '@components/General';
import { formatDate, toApproxCurrency } from '@libs/utils/converters';
import usePagination, { PAGE_ENTRIES } from '@libs/hooks/usePagination';
import fetchTradeHistory, { TradeHistory } from '@archetypes/Portfolio/tradeHistoryAPI';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { useRouter } from 'next/router';
// import { ArbiscanEnum } from '@libs/utils/rpcMethods';
// import Actions from '@components/TokenActions';

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
    const { provider } = useWeb3();
    const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);

    useEffect(() => {
        fetchTradeHistory({ account: '0x36b26d2aF84d7B80e48d31d549eE56bDB0a0BBaE' }).then((r) => setTradeHistory(r));
    }, [provider]);

    const { mintCommits, burnCommits } = useMemo(
        () => ({
            mintCommits: tradeHistory.filter(
                (commit) => commit.type === CommitEnum.long_mint || commit.type === CommitEnum.short_mint,
            ),
            burnCommits: tradeHistory.filter(
                (commit) => commit.type === CommitEnum.long_burn || commit.type === CommitEnum.short_burn,
            ),
        }),
        [tradeHistory],
    );

    const { setPage, page, paginatedArray, numPages } = usePagination(
        focus === CommitsFocusEnum.mints ? mintCommits : burnCommits,
    );

    return (
        <div className="bg-theme-background rounded-xl shadow m-4 p-4">
            <div className="my-4">
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
                {focus === CommitsFocusEnum.mints ? (
                    <>
                        <TableHeader>
                            <TableHeaderCell>Date / Time</TableHeaderCell>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Spent (USDC)</TableHeaderCell>
                            <TableHeaderCell>Received (Tokens) *</TableHeaderCell>
                            <TableHeaderCell>Token Price (USDC) *</TableHeaderCell>
                            {/*<TableHeaderCell>/!* Empty header for buttons column *!/</TableHeaderCell>*/}
                        </TableHeader>
                        {paginatedArray.map((commit, index) => (
                            <CommitRow
                                key={`pcr-${index}`}
                                index={index}
                                provider={provider ?? null}
                                {...commit}
                                burnRow={false}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        <TableHeader>
                            <TableHeaderCell>Date / Time</TableHeaderCell>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Amount (Tokens)</TableHeaderCell>
                            <TableHeaderCell>Token Price (USDC) *</TableHeaderCell>
                            <TableHeaderCell>Return (USDC) *</TableHeaderCell>
                            {/*<TableHeaderCell>/!* Empty header for buttons column *!/</TableHeaderCell>*/}
                        </TableHeader>
                        {paginatedArray.map((commit, index) => (
                            <CommitRow
                                key={`pcr-${index}`}
                                index={index}
                                provider={provider ?? null}
                                {...commit}
                                burnRow={true}
                            />
                        ))}
                    </>
                )}
            </Table>
            <div className="flex">
                <div className="mt-8 max-w-2xl text-sm text-theme-text opacity-80">
                    * <strong>Token Price</strong> and{' '}
                    <strong>{focus === CommitsFocusEnum.mints ? 'Amount' : 'Return'}</strong> values are indicative
                    only, and represent the estimated values for the next rebalance, given the committed mints and burns
                    and change in price of the underlying asset.
                </div>
                <div className="ml-auto mt-auto px-4 sm:px-6 py-3">
                    <PageNumber
                        page={page}
                        numResults={focus === CommitsFocusEnum.mints ? mintCommits.length : burnCommits.length}
                        resultsPerPage={PAGE_ENTRIES}
                    />
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
                        numPages={numPages}
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
        burnRow: number;
    }
> = ({ date, tokenName, tokenAmount, tokenPrice, tokenSymbol, index, burnRow }) => {
    return (
        <TableRow key={index} rowNumber={index}>
            <TableRowCell>{formatDate(new Date(date * 1000))}</TableRowCell>
            <TableRowCell>
                <Logo ticker={tokenSymbolToLogoTicker(tokenSymbol)} className="inline mr-2" />
                {tokenName}
            </TableRowCell>
            {burnRow ? (
                <>
                    <TableRowCell>{tokenAmount.toFixed(2)}</TableRowCell>
                    <TableRowCell>{toApproxCurrency(tokenPrice)}</TableRowCell>
                    <TableRowCell>{toApproxCurrency(tokenAmount.times(tokenPrice))}</TableRowCell>
                </>
            ) : (
                <>
                    <TableRowCell>{toApproxCurrency(tokenAmount)}</TableRowCell>
                    <TableRowCell>{tokenAmount.div(tokenPrice).toFixed(2)}</TableRowCell>
                    <TableRowCell>{toApproxCurrency(tokenPrice)}</TableRowCell>
                </>
            )}
            {/*<TableRowCell className="flex text-right">*/}
            {/*    <Actions*/}
            {/*        token={token}*/}
            {/*        provider={provider}*/}
            {/*        arbiscanTarget={{*/}
            {/*            type: ArbiscanEnum.txn,*/}
            {/*            target: txnHash,*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</TableRowCell>*/}
        </TableRow>
    );
};

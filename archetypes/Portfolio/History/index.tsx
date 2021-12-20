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
    const { provider, account } = useWeb3();
    const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);

    useEffect(() => {
        fetchTradeHistory({ account: account ?? '0' }).then((r) => setTradeHistory(r));
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
                            <TableHeaderCell>Time / Date</TableHeaderCell>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Amount</TableHeaderCell>
                            <TableHeaderCell>Token / Price</TableHeaderCell>
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
                            <TableHeaderCell>Time / Date</TableHeaderCell>
                            <TableHeaderCell>Token</TableHeaderCell>
                            <TableHeaderCell>Amount / Price</TableHeaderCell>
                            <TableHeaderCell>Return</TableHeaderCell>
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
    const { timeString, dateString } = formatDate(new Date(date * 1000));
    return (
        <TableRow key={index} rowNumber={index}>
            <TableRowCell>
                <div>{timeString}</div>
                <div>{dateString}</div>
            </TableRowCell>
            <TableRowCell>
                <Logo ticker={tokenSymbolToLogoTicker(tokenSymbol)} className="inline mr-2" />
                {tokenName}
            </TableRowCell>
            {burnRow ? (
                <>
                    <TableRowCell>
                        <div>{tokenAmount.toFixed(2)} tokens</div>
                        <div className="text-cool-gray-500">at {toApproxCurrency(tokenPrice)} USDC/token</div>
                    </TableRowCell>
                    <TableRowCell>{toApproxCurrency(tokenAmount.times(tokenPrice))} USDC</TableRowCell>
                </>
            ) : (
                <>
                    <TableRowCell>{toApproxCurrency(tokenAmount)} USDC</TableRowCell>
                    <TableRowCell>
                        <div>{tokenAmount.div(tokenPrice).toFixed(2)} tokens</div>
                        <div className="text-cool-gray-500">at {toApproxCurrency(tokenPrice)} USDC/token</div>
                    </TableRowCell>
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

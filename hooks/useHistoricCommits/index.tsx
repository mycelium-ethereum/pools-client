import { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';
import { CommitActionEnum } from '@tracer-protocol/pools-js';
import { CommitActionToQueryFocusMap } from '~/constants/commits';
import { tracerAPIService } from '~/services/TracerAPIService';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';
import { TradeHistory } from '~/types/commits';
import { PAGE_ENTRIES } from '../usePagination';

export const useHistoricCommits = (
    focus: CommitActionEnum,
): {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalRecords: number;
    loading: boolean;
    tradeHistory: TradeHistory[];
} => {
    const { account, network } = useStore(selectWeb3Info, shallow);
    const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    useEffect(() => {
        setLoading(true);
        if (account) {
            tracerAPIService
                .fetchCommitHistory({
                    account: account ?? '0',
                    type: CommitActionToQueryFocusMap[focus as CommitActionEnum],
                    page,
                    pageSize: PAGE_ENTRIES, // TODO: allow user to choose results per page
                })
                .then((r) => {
                    setLoading(false);
                    setTradeHistory(r.results);
                    setTotalRecords(r.totalRecords);
                });
        }
    }, [focus, page, account, network]);

    return {
        tradeHistory,
        page,
        setPage,
        totalRecords,
        loading,
    };
};

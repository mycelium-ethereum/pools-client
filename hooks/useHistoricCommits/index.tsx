import { useEffect, useState } from 'react';
import useSWR from 'swr';
import shallow from 'zustand/shallow';
import { NETWORKS } from '@tracer-protocol/pools-js';
import { CommitTypeFilter } from '~/archetypes/Portfolio/state';
import { useStore } from '~/store/main';
import { selectWeb3Info } from '~/store/Web3Slice';
import { TradeHistory } from '~/types/commits';
import { LoadingRows } from '~/types/hooks';
import { V2_SUPPORTED_NETWORKS } from '~/types/networks';
import { fetchCommitHistory } from '~/utils/tracerAPI';

const PAGE_ENTRIES = 6;

export const useHistoricCommits = (
    typeFilter: CommitTypeFilter,
): {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalRecords: number;
} & LoadingRows<TradeHistory> => {
    const { account, network } = useStore(selectWeb3Info, shallow);
    const [rows, setRows] = useState<TradeHistory[]>([]);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const { data, error } = useSWR(
        ['/commitHistory', account, network, typeFilter, page],
        (_url, account, network, type, page) =>
            fetchCommitHistory({
                account: account ?? '0',
                network: (network as V2_SUPPORTED_NETWORKS) ?? NETWORKS.ARBITRUM,
                type,
                page,
                pageSize: PAGE_ENTRIES, // TODO: allow user to choose results per page
            }),
    );

    useEffect(() => {
        if (data) {
            setTotalRecords(data.totalRecords ?? 0);
            setRows(data.results ?? []);
        }
    }, [data]);

    return {
        rows,
        page,
        setPage,
        totalRecords,
        isLoading: !error && !data,
    };
};

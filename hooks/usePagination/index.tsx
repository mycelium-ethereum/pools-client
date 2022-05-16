import { Dispatch, SetStateAction, useMemo, useEffect, useState } from 'react';

export const DEFAULT_PAGE_ENTRIES = 10;

type PaginationControl = {
    setPage: Dispatch<SetStateAction<number>>;
    paginatedArray: any[];
    numPages: number;
    page: number;
};

// hook to assist with paginating an array
export const usePagination = (arr: any[], pageEntries: number = DEFAULT_PAGE_ENTRIES): PaginationControl => {
    const [page, setPage] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(1);
    const [paginatedArray, setPaginatedArray] = useState<any[]>([]);

    useMemo(() => {
        const start = (page - 1) * pageEntries;
        const end = start + pageEntries;
        setPaginatedArray(arr.slice(start, end));
    }, [page]);

    useEffect(() => {
        if (arr.length) {
            const start = (page - 1) * pageEntries;
            const end = start + pageEntries;
            setPaginatedArray(arr.slice(start, end));
            setNumPages(Math.ceil(arr.length / pageEntries));
        } else {
            setPage(1);
            setNumPages(1);
        }
    }, [arr]);

    return {
        page,
        paginatedArray,
        setPage,
        numPages,
    };
};

export default usePagination;

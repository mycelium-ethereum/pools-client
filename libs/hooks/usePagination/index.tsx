import { Dispatch, SetStateAction, useMemo, useEffect, useState } from 'react';

// TODO could make this a param for configurable number of page entries
export const PAGE_ENTRIES = 10;

// hook to assist with paginating an array
export default ((arr: any[]) => {
    const [page, setPage] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(1);
    const [paginatedArray, setPaginatedArray] = useState<any[]>([]);

    useMemo(() => {
        const start = (page - 1) * PAGE_ENTRIES;
        const end = start + PAGE_ENTRIES;
        setPaginatedArray(arr.slice(start, end));
    }, [page]);

    useEffect(() => {
        if (arr.length) {
            const start = (page - 1) * PAGE_ENTRIES;
            const end = start + PAGE_ENTRIES;
            setPaginatedArray(arr.slice(start, end));
            setNumPages(Math.ceil(arr.length / PAGE_ENTRIES));
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
}) as (arr: any[]) => {
    setPage: Dispatch<SetStateAction<number>>;
    paginatedArray: any[];
    numPages: number;
    page: number;
};

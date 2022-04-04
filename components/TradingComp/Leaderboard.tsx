import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserDivs from '~/components/TradingComp/UserDivs';
import UserTable from '~/components/TradingComp/UserTable';

const Leaderboard: React.FC<{
    data: {
        name: string;
        value: string;
        entryDate: string;
        avatar?: string;
    }[];
}> = ({
    data,
}: {
    data: {
        name: string;
        value: string;
        entryDate: string;
        avatar?: string;
    }[];
}) => {
    const [hasMore, setHasMore] = useState(true);
    const [items, setItems] = useState(data.slice(0, 50));
    const [index, setIndex] = useState(50);
    const fetchMoreData = () => {
        if (items.length >= 500) {
            setHasMore(false);
            return;
        }
        setIndex((index) => index + 50);
    };

    useEffect(() => {
        setItems(data.slice(0, index));
    }, [index]);

    return (
        <div className="w-[calc(100%+32px)] -translate-x-4 transform overflow-auto bg-white py-5 dark:bg-cool-gray-900 sm:rounded-[10px] sm:px-7 sm:drop-shadow-md md:w-full md:translate-x-0">
            <div className="mb-4 flex flex-col-reverse items-start justify-between px-4 text-cool-gray-900 dark:text-white sm:flex-row sm:items-center md:px-0">
                <span className="block text-lg font-bold">Leaderboard</span>
                <div className="flex w-full max-w-[281px] items-center justify-between">
                    <span className="mb-4 block font-semibold">Total Competitors</span>
                    <span className="mb-4 block font-bold">{data.length}</span>
                </div>
            </div>
            <div className="max-h-[550px]">
                <InfiniteScroll
                    dataLength={items.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<span>Loading...</span>}
                    height={550}
                >
                    <UserTable data={items} />
                    <UserDivs data={items} />
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default Leaderboard;

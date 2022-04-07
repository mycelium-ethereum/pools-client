import React, { useEffect, useState } from 'react';
import { TradingCompParticipant } from '~/components/TradingComp/Leaderboard';

const Searchbar: React.FC<{
    data: TradingCompParticipant[];
    setFilteredData: React.Dispatch<React.SetStateAction<TradingCompParticipant[]>>;
}> = ({
    data,
    setFilteredData,
}: {
    data: TradingCompParticipant[];
    setFilteredData: React.Dispatch<React.SetStateAction<TradingCompParticipant[]>>;
}) => {
    const [searchInput, setSearchInput] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const updateResults = () => {
        let searchData = data;
        searchData = searchData.filter((item) => item.username.toLowerCase().includes(searchInput.toLowerCase()));
        setFilteredData(searchData ? searchData : data);
    };

    useEffect(() => {
        updateResults();
    }, [searchInput]);

    return (
        <div className="absolute bottom-0 right-4 ml-[75px] w-[calc(50%-30px)] overflow-hidden rounded-xl border border-cool-gray-900 text-sm text-cool-gray-900 dark:border-white dark:text-white sm:right-0 sm:w-auto md:relative">
            <img
                src="/img/trading-comp/search-icon.svg"
                alt="search"
                className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform dark:invert"
            />
            <input
                type="text"
                className="h-[39px] min-h-[39px] w-full pl-11 sm:w-[180px] md:w-[281px] md:min-w-[281px]"
                value={searchInput}
                onChange={handleChange}
                placeholder="Search"
            />
        </div>
    );
};

export default Searchbar;

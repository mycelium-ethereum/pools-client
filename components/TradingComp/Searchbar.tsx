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
        console.log(data);
        setFilteredData(searchData ? searchData : data);
    };

    useEffect(() => {
        updateResults();
    }, [searchInput]);

    return (
        <div className="relative ml-[75px] hidden overflow-hidden rounded-xl border border-cool-gray-900 text-sm text-cool-gray-900 dark:border-white dark:text-white md:block">
            <img
                src="/img/trading-comp/search-icon.svg"
                alt="search"
                className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform dark:invert"
            />
            <input
                type="text"
                className="h-[39px] min-h-[39px] w-[281px] min-w-[281px] pl-11"
                value={searchInput}
                onChange={handleChange}
                placeholder="Search"
            />
        </div>
    );
};

export default Searchbar;

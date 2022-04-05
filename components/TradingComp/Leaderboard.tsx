import React from 'react';
import Searchbar from '~/components/TradingComp/Searchbar';
import UserDivs from '~/components/TradingComp/UserDivs';
import UserTable from '~/components/TradingComp/UserTable';

export type TradingCompParticipant = {
    address: string;
    username: string;
    entryDate: number;
    claimedCapital: string;
    settlementTokenBalance: string; // realised position
    accountValue: string; // unrealised position
    ranking: number;
    rank?: string;
    disqualified: boolean;
};

const Leaderboard: React.FC<{
    data: TradingCompParticipant[];
    filteredData: TradingCompParticipant[];
    setFilteredData: React.Dispatch<React.SetStateAction<TradingCompParticipant[]>>;
}> = ({
    data,
    filteredData,
    setFilteredData,
}: {
    data: TradingCompParticipant[];
    filteredData: TradingCompParticipant[];
    setFilteredData: React.Dispatch<React.SetStateAction<TradingCompParticipant[]>>;
}) => {
    return (
        <div className="w-[calc(100%+32px)] -translate-x-4 transform overflow-auto bg-white py-5 dark:bg-cool-gray-900 sm:w-full sm:translate-x-0 sm:rounded-[10px] sm:px-7 sm:drop-shadow-md">
            <div className="mb-4 flex flex-col-reverse items-start justify-between px-4 text-cool-gray-900 dark:text-white sm:flex-row sm:items-center md:px-0">
                <span className="block text-lg font-bold">Leaderboard</span>
                <div className="flex items-center">
                    <div className="flex items-center">
                        <span className="block font-semibold">Total Competitors</span>
                        <span className="ml-6 block font-bold">{data.length.toLocaleString('en-US')}</span>
                    </div>
                    <Searchbar data={data} setFilteredData={setFilteredData} />
                </div>
            </div>
            <div className="max-h-[560px] overflow-auto">
                <UserTable data={filteredData} />
                <UserDivs data={filteredData} />
            </div>
        </div>
    );
};

export default Leaderboard;

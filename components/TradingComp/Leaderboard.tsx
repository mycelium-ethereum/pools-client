import React from 'react';
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
}> = ({ data }: { data: TradingCompParticipant[] }) => {
    return (
        <div className="w-[calc(100%+32px)] -translate-x-4 transform overflow-auto bg-white py-5 dark:bg-cool-gray-900 sm:w-full sm:translate-x-0 sm:rounded-[10px] sm:px-7 sm:drop-shadow-md">
            <div className="mb-4 flex flex-col-reverse items-start justify-between px-4 text-cool-gray-900 dark:text-white sm:flex-row sm:items-center md:px-0">
                <span className="block text-lg font-bold">Leaderboard</span>
                <div className="flex w-full items-center justify-between sm:max-w-[281px]">
                    <span className="mb-4 block font-semibold">Total Competitors</span>
                    <span className="mb-4 block font-bold">{data.length.toLocaleString('en-US')}</span>
                </div>
            </div>
            <div className="max-h-[560px] overflow-auto">
                <UserTable data={data} />
                <UserDivs data={data} />
            </div>
        </div>
    );
};

export default Leaderboard;

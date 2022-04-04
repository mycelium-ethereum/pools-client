import React from 'react';
import TwitterShareButton from '~/components/General/Button/TwitterShareButton';

const StatisticsBox: React.FC<{
    name: string;
    avatar: string;
    rank: string;
    value: string;
    entryDate: string;
    handleOpen: () => void;
}> = ({
    name,
    avatar,
    rank,
    value,
    entryDate,
    handleOpen,
}: {
    name: string;
    avatar: string;
    rank: string;
    value: string;
    entryDate: string;
    handleOpen: () => void;
}) => {
    return (
        <div className="h-[189px] w-full bg-[#F0F0FF] rounded-lg p-6 dark:bg-purple-300 dark:bg-opacity-10">
            <div className="flex flex-col justify-evenly h-full">
                <div className="flex justify-between w-full items-center mb-2.5">
                    <span className="flex items-center justify-center h-5 w-[113px] bg-purple-300 rounded-[3px] text-white text-xs">
                        YOUR STATISTICS
                    </span>
                    <div className="flex items-center">
                        <img src={avatar} className="h-5 w-5 rounded-full mr-1" />
                        <span className="font-bold text-sm text-cool-gray-900 dark:text-white">{name}</span>
                        <button onClick={handleOpen}>
                            <span className="inline-block ml-2 text-purple-300 underline text-sm">Edit Profile</span>
                        </button>
                    </div>
                </div>
                <div className="flex text-cool-gray-800 dark:text-white">
                    <div className="mr-6 ">
                        <div className="font-bold flex items-end">
                            <span className="text-base inline-block mr-0.5">#</span>
                            <span className="text-[32px] leading-[1]">{rank}</span>
                        </div>
                        <span className="block text-sm font-semibold ml-2">Rank</span>
                    </div>
                    <div className="mr-6">
                        <div className="font-bold flex items-end">
                            <span className="text-base inline-block mr-0.5">$</span>
                            <span className="text-[32px] leading-[1]">{value}</span>
                        </div>
                        <span className="block text-sm font-semibold ml-2">Portfolio Value</span>
                    </div>
                    <div>
                        <div className="font-bold flex items-end">
                            <span className="text-[32px] leading-[1]">{entryDate}</span>
                        </div>
                        <span className="block text-sm font-semibold">Portfolio Value</span>
                    </div>
                </div>
                <TwitterShareButton className="mt-2.5" url="https://v2beta.tracer.finance/trading-comp" />
            </div>
        </div>
    );
};

export default StatisticsBox;

import React from 'react';
import TwitterShareButton from '~/components/General/Button/TwitterShareButton';
import EditProfile from '~/components/TradingComp/EditProfile';

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
        <div className="w-full rounded-lg bg-[#F0F0FF] p-6 dark:bg-purple-300 dark:bg-opacity-10 sm:h-[189px] sm:min-h-[189px]">
            <div className="flex h-full flex-col justify-evenly">
                <div className="mb-2.5 flex w-full justify-between sm:items-center">
                    <span className="flex h-5 w-[113px] items-center justify-center rounded-[3px] bg-purple-300 text-xs text-white">
                        YOUR STATISTICS
                    </span>
                    <EditProfile name={name} avatar={avatar} handleOpen={handleOpen} />
                </div>
                <div className="flex items-end sm:flex-col sm:items-start">
                    <div className="flex flex-wrap font-inter text-cool-gray-800 dark:text-white">
                        <div className="mr-6 mb-2 sm:mb-0">
                            <div className="flex items-end font-bold">
                                <span className="mr-0.5 inline-block text-base">#</span>
                                <span className="text-[32px] leading-[1]">{rank}</span>
                            </div>
                            <span className="ml-2 block text-sm font-semibold">Rank</span>
                        </div>
                        <div className="mr-6 mb-2 sm:mb-0">
                            <div className="flex items-end font-bold">
                                <span className="mr-0.5 inline-block text-base">$</span>
                                <span className="text-[32px] leading-[1]">{value}</span>
                            </div>
                            <span className="ml-2 block text-sm font-semibold">Portfolio Value</span>
                        </div>
                        <div>
                            <div className="flex items-end font-bold">
                                <span className="text-[32px] leading-[1]">{entryDate}</span>
                            </div>
                            <span className="block text-sm font-semibold">Portfolio Value</span>
                        </div>
                    </div>
                    <TwitterShareButton
                        className="mt-2.5 ml-6 sm:ml-0"
                        url="https://v2beta.tracer.finance/trading-comp"
                    />
                </div>
            </div>
        </div>
    );
};

export default StatisticsBox;

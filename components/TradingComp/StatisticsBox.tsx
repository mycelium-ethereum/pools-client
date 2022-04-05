import React, { useEffect } from 'react';
import TwitterShareButton from '~/components/General/Button/TwitterShareButton';
import { convertCurrency, convertShortDate } from '~/utils/converters';

const StatisticsBox: React.FC<{
    username: string;
    rank: string;
    accountValue: string;
    entryDate: number;
}> = ({
    username,
    rank,
    accountValue,
    entryDate,
}: {
    username: string;
    rank: string;
    accountValue: string;
    entryDate: number;
}) => {
    const [url, setUrl] = React.useState('');

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return (
        <div className="w-full rounded-lg bg-[#F0F0FF] p-6 dark:bg-purple-300 dark:bg-opacity-10 sm:h-[189px] sm:min-h-[189px]">
            <div className="flex h-full flex-col justify-evenly">
                <div className="mb-2.5 flex w-full justify-between sm:items-center">
                    <span className="flex h-5 w-[113px] items-center justify-center rounded-[3px] bg-purple-300 text-xs text-white">
                        YOUR STATISTICS
                    </span>
                    <div className="flex flex-col items-end sm:flex-row sm:items-center">
                        <div className="flex items-center">
                            <span className="text-sm font-bold text-cool-gray-900 dark:text-white">{username}</span>
                        </div>
                    </div>
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
                                <span className="text-[32px] leading-[1]">{convertCurrency(accountValue)}</span>
                            </div>
                            <span className="ml-2 block text-sm font-semibold">Portfolio Value</span>
                        </div>
                        <div>
                            <div className="flex items-end font-bold">
                                <span className="text-[32px] leading-[1]">{convertShortDate(entryDate)}</span>
                            </div>
                            <span className="block text-sm font-semibold">Entry Date</span>
                        </div>
                    </div>
                    <TwitterShareButton className="mt-2.5 ml-6 sm:ml-0" url={url} />
                </div>
            </div>
        </div>
    );
};

export default StatisticsBox;

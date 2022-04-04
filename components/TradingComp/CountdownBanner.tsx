import React from 'react';
import Countdown from 'react-countdown';

const CountdownBanner: React.FC = () => {
    const renderer = ({
        days,
        hours,
        minutes,
        seconds,
    }: {
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
    }) => {
        // Render a countdown
        return (
            <span>
                <span className="font-bold text-white">
                    {days} days, {hours} hours, {minutes} Minutes, {seconds} Seconds
                </span>
            </span>
        );
    };

    const calculateDateDifference = () => {
        const endDate = Date.parse('30 Apr 2022 00:00:00 GMT');
        return endDate - Date.now();
    };

    return (
        <div className="relative w-full rounded-lg mr-4 overflow-hidden font-aileron">
            <img src="/img/trading-comp/trading-comp-banner.png" className="absolute w-full h-full object-cover z-0" />
            <div className="flex flex-col h-[382px] relative z-10 flex-grow">
                <div className="flex-grow h-full flex flex-col justify-center px-5">
                    <span className="block font-semibold text-base text-purple-100">Perpetual Pools V2</span>
                    <span className="block">
                        <span className="text-[32px] text-purple-50">Trading</span>{' '}
                        <span className="font-bold text-[32px] text-white">Competition</span>
                    </span>
                </div>
                <div>
                    <div className="px-5 mb-2">
                        <span className="block text-sm font-semibold leading-[18px] text-purple-100">Prize Pool</span>
                        <div className="flex text-white">
                            <div className="mr-8">
                                <span className="font-bold text-[32px] leading-[48px]">$20,000</span>
                                <span className="block font-semibold text-xs leading-[18px]">Trading Compeition</span>
                            </div>
                            <div className="mr-8">
                                <span className="font-bold text-[32px] leading-[48px]">$5,000</span>
                                <span className="block font-semibold text-xs leading-[18px]">UX Feedback</span>
                            </div>
                            <div className="mr-8">
                                <span className="font-bold text-[32px] leading-[48px]">$500,000</span>
                                <span className="block font-semibold text-xs leading-[18px]">Bug Bounty</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-purple-300 min-h-[36px] h-9 px-5 bg-opacity-40 text-xs flex items-center">
                    <span className="inline-block text-purple-100 mr-4">Time Left</span>
                    <Countdown date={Date.now() + calculateDateDifference()} renderer={renderer} />,
                </div>
            </div>
        </div>
    );
};

export default CountdownBanner;

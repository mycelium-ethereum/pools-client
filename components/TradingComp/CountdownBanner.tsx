import React from 'react';
import Countdown from 'react-countdown';

const CountdownBanner: React.FC = () => {
    const renderer = ({
        days,
        hours,
        minutes,
        seconds,
    }: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
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

    const moneyStyles = 'font-bold text-xl leading-[150%] sm:text-[32px] sm:leading-[48px]';
    const statStyles = 'block font-semibold text-xs leading-[18px]';

    return (
        <div className="transition-border relative mr-4 w-[calc(100%+32px)] -translate-x-4 transform overflow-hidden font-aileron duration-300 sm:w-full sm:translate-x-0 sm:rounded-lg">
            <img src="/img/trading-comp/trading-comp-banner.png" className="absolute z-0 h-full w-full object-cover" />
            <div className="relative z-10 flex h-[304px] flex-grow flex-col sm:h-[382px]">
                <div className="flex h-full flex-grow flex-col justify-center px-5">
                    <span className="block text-base font-semibold text-purple-100">Perpetual Pools V2</span>
                    <span className="block">
                        <span className="text-[32px] text-purple-50">Trading</span>{' '}
                        <span className="text-[32px] font-bold text-white">Competition</span>
                    </span>
                </div>
                <div>
                    <div className="mb-2 px-5">
                        <span className="block text-sm font-semibold leading-[18px] text-purple-100">Prize Pool</span>
                        <div className="flex text-white">
                            <div className="mr-8">
                                <span className={moneyStyles}>$20,000</span>
                                <span className={statStyles}>Trading Compeition</span>
                            </div>
                            <div className="mr-8">
                                <span className={moneyStyles}>$5,000</span>
                                <span className={statStyles}>UX Feedback</span>
                            </div>
                            <div className="mr-8">
                                <span className={moneyStyles}>$500,000</span>
                                <span className={statStyles}>Bug Bounty</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex h-[62px] min-h-[62px] w-full flex-col items-start justify-center bg-purple-300 bg-opacity-40 px-5 text-xs sm:h-9 sm:min-h-[36px] sm:flex-row sm:items-center sm:justify-start">
                    <span className="mr-4 inline-block text-purple-100">Time Left</span>
                    <Countdown date={Date.now() + calculateDateDifference()} renderer={renderer} />
                </div>
            </div>
        </div>
    );
};

export default CountdownBanner;

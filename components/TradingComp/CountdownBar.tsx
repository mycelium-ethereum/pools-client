import React from 'react';
import Countdown from 'react-countdown';

const CountdownBar: React.FC = () => {
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
                    {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
                </span>
            </span>
        );
    };

    const calculateDateDifference = () => {
        const endDate = Date.parse('16 Apr 2022 15:00:00 EST');
        return endDate - Date.now();
    };

    return (
        <div className="flex h-[62px] min-h-[62px] w-full flex-col items-start justify-center bg-purple-300 bg-opacity-40 px-5 text-xs sm:h-9 sm:min-h-[36px] sm:flex-row sm:items-center sm:justify-start sm:rounded-bl-lg sm:rounded-br-lg">
            <span className="mr-4 inline-block text-purple-100">Time Left</span>
            <Countdown date={Date.now() + calculateDateDifference()} renderer={renderer} />
        </div>
    );
};

export default CountdownBar;

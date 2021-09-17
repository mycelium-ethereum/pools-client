import React, { useEffect, useState, useMemo } from 'react';
import { timeTill } from '@libs/utils/converters';

/**
 * Counts down to targetTime. This is generally lastUpdatedTime + updateInterval
 * @param targetTime time you want to countdown till in seconds
 *
 */
export const TimeLeft: React.FC<{
    nextRebalance: number;
    className?: string;
    hideHours?: boolean;
    hideMinutes?: boolean;
    hideSeconds?: boolean;
}> = ({ nextRebalance, className, hideHours, hideMinutes, hideSeconds }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useMemo(() => {
        const timeTill_ = timeTill(nextRebalance);
        setHours(timeTill_.h ?? 0);
        setMinutes(timeTill_.m ?? 0);
        setSeconds(timeTill_.s ?? 0);
    }, [nextRebalance]);

    useEffect(() => {
        const myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes > 0) {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                }
                if (minutes === 0) {
                    if (hours > 0) {
                        setSeconds(59);
                        setMinutes(59);
                        setHours(hours - 1);
                    }
                    if (hours === 0) {
                        // seconds, minutes and hours is all 0
                        clearInterval(myInterval);
                    }
                }
            }
        }, 1000);
        return () => {
            clearInterval(myInterval);
        };
    });

    return (
        <>
            <span className={className}>
                {!hideHours ? `${hours}h ` : ''}
                {!hideMinutes ? `${minutes}m ` : ''}
                {!hideSeconds ? `${seconds}s` : ''}
            </span>
        </>
    );
};

export const ReceiveIn: React.FC<{
    nextRebalance: number;
    frontRunningInterval: number;
    updateInterval: number;
    className?: string;
}> = ({ nextRebalance, frontRunningInterval, updateInterval, className }) => {
    const [rebalance, setRebalance] = useState(nextRebalance);

    // this checks if its in the front running interval each second
    // if it is you will receive in the next rebalance round
    useEffect(() => {
        const secondCheck = setInterval(() => {
            if (rebalance - Math.round(Date.now() / 1000) < frontRunningInterval) {
                setRebalance(Math.round(Date.now() / 1000) + updateInterval + frontRunningInterval);
            }
        }, 1000);

        return () => {
            clearInterval(secondCheck);
        };
    });
    return <TimeLeft className={className} nextRebalance={rebalance} />;
};

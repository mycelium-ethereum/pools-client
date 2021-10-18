import React, { useEffect, useState, useMemo } from 'react';
import { timeTill } from '@libs/utils/converters';

/**
 * Counts down to targetTime. This is generally lastUpdatedTime + updateInterval
 * @param targetTime time you want to countdown till in seconds
 *
 */
export default (({ targetTime, className, hideHours, hideMinutes, hideSeconds, countdownEnded, countdownStarted }) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useMemo(() => {
        if (targetTime - Date.now() / 1000 < 0) {
            return;
        }
        const timeTill_ = timeTill(targetTime);
        setHours(timeTill_.h ?? 0);
        setMinutes(timeTill_.m ?? 0);
        setSeconds(timeTill_.s ?? 0);
        if (countdownStarted) {
            countdownStarted();
        }
    }, [targetTime]);

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
                        if (countdownEnded) {
                            countdownEnded();
                        }
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
}) as React.FC<{
    targetTime: number;
    hideHours?: boolean;
    hideMinutes?: boolean;
    hideSeconds?: boolean;
    className?: string;
    countdownStarted?: () => any;
    countdownEnded?: () => any;
}>;

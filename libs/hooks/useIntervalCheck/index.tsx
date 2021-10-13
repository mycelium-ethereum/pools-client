import { useState, useEffect, useMemo } from 'react';

// const useIntervalCheck
// hook used to trigger updates when the user enters the front running interval
export default ((nextUpdate, frontRunningInterval) => {
    const [isBeforeFrontRunning, setIsBeforeFrontRunning] = useState<boolean>(true);

    // this resets the isBeforeFrontRunning whenever nextUpdate changes
    // this is to ensure whenever the timer is fired that setting isBeforeFrontRunning
    // will trigger an update
    useMemo(() => {
        setIsBeforeFrontRunning(true);
    }, [nextUpdate]);

    useEffect(() => {
        const now = Math.floor(Date.now() / 1000);
        const isBeforeFrontRunning_ = nextUpdate - frontRunningInterval > now;
        let waiting: any;
        if (isBeforeFrontRunning_ && nextUpdate !== 0) {
            // waits for it to enter the front running interval
            console.debug(`Setting a timeout for ${nextUpdate - frontRunningInterval - now}s`);
            waiting = setTimeout(() => {
                console.debug(
                    `Timer is now before the front-running interval. Current isBeforeFrontRunning: ${isBeforeFrontRunning}`,
                );
                setIsBeforeFrontRunning(false);
            }, (nextUpdate - frontRunningInterval - now) * 1000);
        } else {
            setIsBeforeFrontRunning(isBeforeFrontRunning_);
        }

        return () => {
            if (waiting) {
                clearTimeout(waiting);
            }
        };
    }, [nextUpdate]);

    return isBeforeFrontRunning;
}) as (nextUpdate: number, frontRunningInterval: number) => boolean;

import { useState, useEffect } from 'react';

// checks if the current time is before the front running interval
const checkInterval: (nextUpdate: number, frontRunningInterval: number) => boolean = (
    nextUpdate,
    frontRunningInterval,
) => {
    const now = Date.now() / 1000;
    if (nextUpdate - frontRunningInterval > now) {
        return true;
    } else {
        return false;
    }
};
// const useIntervalCheck
// hook used to trigger updates when the user enters the front running interval
export default ((nextUpdate, frontRunningInterval) => {
    const [isBeforeFrontRunning, setIsBeforeFrontRunning] = useState(true);

    // checks every 5 seconds if the front running interval has been met
    useEffect(() => {
        const check = setInterval(() => {
            if (nextUpdate !== 0) {
                setIsBeforeFrontRunning(checkInterval(nextUpdate, frontRunningInterval));
            }
        }, 5000);

        return () => clearInterval(check);
    }, [nextUpdate]);

    return isBeforeFrontRunning;
}) as (nextUpdate: number, frontRunningInterval: number) => boolean;

import { useState, useEffect } from 'react';
import { BigNumber } from 'bignumber.js';
import useIntervalCheck from '../useIntervalCheck';

// returns the timestamp when a commit is expected to be executed
// const useExpectedCommitExecution
export default ((lastUpdate, updateInterval, frontRunningInterval) => {
    const [expectedRebalance, setExpectedRebalance] = useState(0);

    const beforeFrontRunning = useIntervalCheck(expectedRebalance, frontRunningInterval.toNumber());

    useEffect(() => {
        setExpectedRebalance(lastUpdate.plus(updateInterval).toNumber());
    }, [lastUpdate, updateInterval]);

    useEffect(() => {
        if (!beforeFrontRunning) {
            if (!lastUpdate.eq(0)) {
                const nextUpdate = lastUpdate.plus(updateInterval.times(2)).toNumber();
                setExpectedRebalance(Math.floor(nextUpdate));
            }
        }
    }, [beforeFrontRunning]);

    return expectedRebalance;
}) as (lastUpdate: BigNumber, updateInterval: BigNumber, frontRunningInterval: BigNumber) => number;

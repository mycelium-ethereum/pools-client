import { useState, useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { getExpectedExecutionTimestamp } from '@tracer-protocol/pools-js';
import useIntervalCheck from '../useIntervalCheck';

// returns the timestamp when a commit is expected to be executed
// const useExpectedCommitExecution
export const useExpectedCommitExecution = (
    lastUpdate: BigNumber,
    updateInterval: BigNumber,
    frontRunningInterval: BigNumber,
): number => {
    const [expectedRebalance, setExpectedRebalance] = useState(0);

    const beforeFrontRunning = useIntervalCheck(expectedRebalance, frontRunningInterval.toNumber());

    useMemo(() => {
        setExpectedRebalance(
            getExpectedExecutionTimestamp(
                frontRunningInterval.toNumber(),
                updateInterval.toNumber(),
                lastUpdate.toNumber(),
                Math.floor(Date.now() / 1000),
            ),
        );
    }, [lastUpdate, updateInterval, beforeFrontRunning]);

    return expectedRebalance;
};

export default useExpectedCommitExecution;

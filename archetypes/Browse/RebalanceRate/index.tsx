import React from 'react';
import { classNames } from '@libs/utils/functions';

// the value of each < or >
const INCREMENT = 0.02;

// maximum amount of > and <
const MAX_CHARS = 10;

/**
 * Likely rebalance rate is between 1 and 1.2
 * Rebalance rate is good for longs if it is less than 1 and good for shorts if its greater than 1
 */
export default (({ rebalanceRate }) => {
    const [long, short] = formatEachSide(rebalanceRate);
    return (
        <div>
            <span className="text-green-500">{long}</span>
            <span className={classNames(rebalanceRate <= 1 ? 'text-green-500' : 'text-red-500')}>|</span>
            <span className="text-red-500">{short}</span>
        </div>
    );
}) as React.FC<{
    rebalanceRate: number;
}>;

const formatEachSide: (rebalanceRate: number) => [string, string] = (rebalanceRate) => {
    const zeroed = rebalanceRate - 1;
    let rhs = 5,
        lhs = 5;
    if (zeroed > 0) {
        // short in favour
        // we want to limit the amount of RHS < we display
        // but save atleast 1 char for the other side
        rhs = Math.min(Math.floor(zeroed / INCREMENT + Math.floor(MAX_CHARS / 2)), MAX_CHARS - 1);
        lhs = MAX_CHARS - rhs;
    } else if (zeroed < 0) {
        // long in favour
        lhs = Math.min(Math.floor(Math.abs(zeroed) / INCREMENT) + Math.floor(MAX_CHARS / 2), MAX_CHARS - 1);
        rhs = MAX_CHARS - lhs;
    }

    return ['>'.repeat(lhs), '<'.repeat(rhs)];
};

import React, { useState, useEffect } from 'react';
import { BigNumber } from 'bignumber.js';
import { useStore } from '@store/main';
import { usePools } from '@context/PoolContext';
import { toApproxCurrency } from '~/utils/converters';
import { classNames } from '~/utils/helpers';
import TracerLoading from '@public/img/logos/tracer/tracer-loading-white.svg';
import { selectPendingCount } from '@store/TransactionSlice';

const useBalance = () => {
    const { pools } = usePools();
    const [balance, setBalance] = useState<BigNumber>(new BigNumber(0));

    useEffect(() => {
        if (pools && Object.keys(pools).length) {
            // it doesnt matter which pool we use
            // since they should all have the same settlement token
            setBalance(Object.values(pools)[0]?.userBalances.settlementToken?.balance ?? new BigNumber(0));
        }
    }, [pools]);

    return balance;
};

export default (({ hide, className }) => {
    const pendingCount = useStore(selectPendingCount);
    const balance = useBalance();

    return (
        <div className={classNames('whitespace-nowrap text-white', hide ? 'hidden' : 'block', className ?? '')}>
            {pendingCount > 0 ? (
                <div className="flex">
                    <div className="w-8 mx-2">
                        <TracerLoading />
                    </div>
                    <div>{`${pendingCount} Pending`}</div>
                </div>
            ) : (
                `${toApproxCurrency(balance)} USDC`
            )}
        </div>
    );
}) as React.FC<{
    hide?: boolean;
    className?: string;
}>;

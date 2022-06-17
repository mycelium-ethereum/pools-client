import React from 'react';
import usePoolWatcher from '~/hooks/usePoolWatcher';
import { useUpdateMarketSpotPrices } from '~/hooks/useUpdateMarketSpotPrices';
import { useUpdatePoolInstances } from '~/hooks/useUpdatePoolInstances';
import { useUpdateWeb3Store } from '~/hooks/useUpdateWeb3Store';

export const StoreUpdater = (): JSX.Element => {
    // any store hooks
    // using seperate component avoids app level re-renders
    useUpdateWeb3Store();
    usePoolWatcher();
    useUpdatePoolInstances();
    useUpdateMarketSpotPrices();
    return <></>;
};

export default StoreUpdater;

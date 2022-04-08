import React from 'react';
import usePoolWatcher from '~/hooks/usePoolWatcher';
import { useUpdatePoolInstances } from '~/hooks/useUpdatePoolInstances';
import { useUpdatePoolLists } from '~/hooks/useUpdatePoolLists';
import { useUpdateWeb3Store } from '~/hooks/useUpdateWeb3Store';

export const StoreUpdater = (): JSX.Element => {
    // any store hooks
    // using seperate component avoids app level re-renders
    useUpdateWeb3Store();
    useUpdatePoolLists();
    usePoolWatcher();
    useUpdatePoolInstances();
    return <></>;
};

export default StoreUpdater;

import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';

export default (() => {
    const { poolFarms, refreshFarm, fetchingFarms } = useFarms();
    return (
        <>
            <StakeGeneric
                logo=""
                title="Stake Pool Tokens"
                subTitle="Stake Pool Tokens and earn TCR."
                tokenType="Pool"
                refreshFarm={refreshFarm}
                farms={poolFarms}
                fetchingFarms={fetchingFarms}
            />
        </>
    );
}) as React.FC;

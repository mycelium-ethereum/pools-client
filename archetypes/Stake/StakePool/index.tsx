import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';

export default (() => {
    const { farms, refreshFarm, fetchingFarms } = useFarms();
    return (
        <>
            <StakeGeneric
                logo=""
                title="Stake Pool Tokens"
                subTitle="Stake Pool Tokens and earn TCR."
                tokenType="Pool"
                refreshFarm={refreshFarm}
                farms={farms}
                fetchingFarms={fetchingFarms}
            ></StakeGeneric>
        </>
    );
}) as React.FC;

import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';

export default (() => {
    const { farms, refreshFarm, fetchingFarms } = useFarms();
    return (
        <>
            <StakeGeneric
                logo="BALANCER"
                title="Balancer Pool Token Strategies"
                subTitle="Stake Balancer Pool Tokens and earn TCR."
                tokenType="Balancer Pool"
                refreshFarm={refreshFarm}
                fetchingFarms={fetchingFarms}
                farms={farms}
                hideSideFilter
                strategySubtitle="via Balancer AMM"
            ></StakeGeneric>
        </>
    );
}) as React.FC;

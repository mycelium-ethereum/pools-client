import React from 'react';

import { useFarms } from '~/context/FarmContext';
import StakeGeneric from '../StakeGeneric';

export default (() => {
    const { farms, refreshFarm, fetchingFarms, rewardsTokenUSDPrices } = useFarms();
    return (
        <StakeGeneric
            logo="BALANCER"
            title="Balancer Pool Token Strategies"
            subTitle="Stake Balancer Pool Tokens and earn rewards."
            tokenType="Balancer Pool"
            refreshFarm={refreshFarm}
            fetchingFarms={fetchingFarms}
            farms={farms}
            rewardsTokenUSDPrices={rewardsTokenUSDPrices}
            hideSideFilter
        />
    );
}) as React.FC;

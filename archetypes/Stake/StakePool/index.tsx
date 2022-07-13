import React from 'react';

import { useFarms } from '~/context/FarmContext';
import StakeGeneric from '../StakeGeneric';

export default (() => {
    const { farms, refreshFarm, fetchingFarms, rewardsTokenUSDPrices } = useFarms();

    return (
        <StakeGeneric
            title="Stake Tokens"
            subTitle="Stake Tokens and earn rewards."
            refreshFarm={refreshFarm}
            farms={farms}
            fetchingFarms={fetchingFarms}
            rewardsTokenUSDPrices={rewardsTokenUSDPrices}
        />
    );
}) as React.FC;

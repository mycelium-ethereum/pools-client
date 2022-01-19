import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';

export default (() => {
    const { farms, refreshFarm, fetchingFarms, rewardsTokenUSDPrices } = useFarms();

    return (
        <>
            <StakeGeneric
                title="Stake Tracer Pool Tokens"
                subTitle="Stake Tracer Pool Tokens and earn rewards."
                tokenType="Tracer Pool"
                refreshFarm={refreshFarm}
                farms={farms}
                fetchingFarms={fetchingFarms}
                rewardsTokenUSDPrices={rewardsTokenUSDPrices}
            />
        </>
    );
}) as React.FC;

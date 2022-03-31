import React from 'react';

import { useFarms } from '~/context/FarmContext';
import StakeGeneric from '../StakeGeneric';

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

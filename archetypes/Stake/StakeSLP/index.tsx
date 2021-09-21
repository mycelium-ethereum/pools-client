import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';

export default (() => {
    const { slpFarms, refreshFarm, fetchingFarms } = useFarms();
    return (
        <>
            <StakeGeneric
                logo="SUSHI"
                title="SLP Token Strategies"
                subTitle="Stake SLP Tokens and earn TCR."
                tokenType="SLP"
                refreshFarm={refreshFarm}
                fetchingFarms={fetchingFarms}
                farms={slpFarms}
                hideSideFilter
                strategySubtitle="via SushiSwap AMM"
            ></StakeGeneric>
        </>
    );
}) as React.FC;

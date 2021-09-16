import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';

export default (() => {
    const { slpFarms, refreshFarm } = useFarms();
    return (
        <>
            <StakeGeneric
                logo="SUSHI"
                title="SLP Token Strategies"
                subTitle="Stake SLP Tokens and earn TCR."
                tokenType="SLP"
                refreshFarm={refreshFarm}
                farms={slpFarms}
                hideLeverageFilter
                hideSideFilter
            ></StakeGeneric>
        </>
    );
}) as React.FC;

import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';

export default (() => {
    const { slpFarms, refreshFarm } = useFarms();
    return (
        <>
            <StakeGeneric
                title="Stake SLP Tokens"
                subTitle="Stake SLP Tokens and earn TCR."
                tokenType="SLP"
                refreshFarm={refreshFarm}
                farms={slpFarms}
            ></StakeGeneric>
        </>
    );
}) as React.FC;

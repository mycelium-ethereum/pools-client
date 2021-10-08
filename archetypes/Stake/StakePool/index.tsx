import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';

export default (() => {
    const { farms, refreshFarm, fetchingFarms, tcrUSDCPrice } = useFarms();

    return (
        <>
            <StakeGeneric
                logo=""
                title="Stake Tracer Pool Tokens"
                subTitle="Stake Tracer Pool Tokens and earn TCR."
                tokenType="Tracer Pool"
                refreshFarm={refreshFarm}
                farms={farms}
                fetchingFarms={fetchingFarms}
                tcrUSDCPrice={tcrUSDCPrice}
            />
        </>
    );
}) as React.FC;

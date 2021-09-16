import React from 'react';
import { useFarms } from '@context/FarmContext';
import StakeGeneric from '../StakeGeneric';

export default (() => {
    const { poolFarms: farms } = useFarms();
    return (
        <>
            <StakeGeneric
                logo=""
                title="Pool Token Strategies"
                subTitle="Stake Pool Tokens and earn TCR."
                farms={farms}
            />
        </>
    );
}) as React.FC;

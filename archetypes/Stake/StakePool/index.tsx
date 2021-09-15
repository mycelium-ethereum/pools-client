import React, { useEffect, useReducer } from 'react';

import { useFarms } from '@context/FarmContext';

import StakeGeneric from '../StakeGeneric';

export default (() => {
    const { poolFarms: farms } = useFarms();
    return (
        <>
            <StakeGeneric
                title="Stake Pool Tokens"
                subTitle="Stake Pool Tokens and earn TCR."
                farms={farms}
            ></StakeGeneric>
        </>
    );
}) as React.FC;

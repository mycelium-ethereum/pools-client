import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';

export default (() => {
    const { slpFarms: farms } = useFarms();
    return (
        <>
            <StakeGeneric
                title="Stake SLP Tokens"
                subTitle="Stake SLP Tokens and earn TCR."
                farms={farms}
            ></StakeGeneric>
        </>
    );
}) as React.FC;

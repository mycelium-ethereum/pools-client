import React from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';
import { useTheme } from '@context/ThemeContext';

export default (() => {
    const { isDark } = useTheme();
    const { farms, refreshFarm, fetchingFarms, tcrUSDCPrice } = useFarms();
    return (
        <StakeGeneric
            logo={`${isDark ? 'BALANCER_LIGHT' : 'BALANCER_DARK'}`}
            title="Balancer Pool Token Strategies"
            subTitle="Stake Balancer Pool Tokens and earn TCR."
            tokenType="Balancer Pool"
            refreshFarm={refreshFarm}
            fetchingFarms={fetchingFarms}
            farms={farms}
            tcrUSDCPrice={tcrUSDCPrice}
            hideSideFilter
        />
    );
}) as React.FC;

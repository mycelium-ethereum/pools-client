import React, { useEffect, useState } from 'react';

import StakeGeneric from '../StakeGeneric';
import { useFarms } from '@context/FarmContext';
import OnboardStakeModal from '@components/OnboardModal/Stake';

export default (() => {
    const { farms, refreshFarm, fetchingFarms, tcrUSDCPrice } = useFarms();
    const [showOnboardStakeModal, setShowOnboardStakeModal] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('onboard.completedStakeTutorial') !== 'true') {
            const timeout = setTimeout(() => {
                setShowOnboardStakeModal(true);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, []);

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
            <OnboardStakeModal
                showOnboardModal={showOnboardStakeModal}
                setShowOnboardModal={() => {
                    setShowOnboardStakeModal(false);
                    localStorage.setItem('onboard.completedStakeTutorial', 'true');
                }}
            />
        </>
    );
}) as React.FC;

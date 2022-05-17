import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StakePool from '~/archetypes/Stake/StakePool';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import NavBar from '~/components/Nav/Navbar';
import OnboardStakeModal from '~/components/OnboardModal/Stake';
import { FarmStore } from '~/context/FarmContext';

export default (() => {
    const router = useRouter();
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardStep, setOnboardStep] = useState<number>(1);

    useEffect(() => {
        router.prefetch('/stake');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <NavBar setShowOnboardModal={setShowOnboardModal} />
            <FarmStore>
                <StakePool />
            </FarmStore>
            <UnsupportedNetworkPopup />
            <Footer />

            <OnboardStakeModal
                onboardStep={onboardStep}
                setOnboardStep={setOnboardStep}
                showOnboardModal={showOnboardModal}
                setShowOnboardModal={() => {
                    setShowOnboardModal(false);
                    setTimeout(() => {
                        setOnboardStep(1);
                    }, 1000);
                }}
            />
        </div>
    );
}) as React.FC;

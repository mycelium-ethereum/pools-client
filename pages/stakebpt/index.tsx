import React, { useEffect, useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import StakeBPT from '@archetypes/Stake/StakeBPT';
import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';
import PendingCommits from '@components/PendingCommits';
import OnboardStakeModal from '@components/OnboardModal/Stake';
import UnsupportedNetworkPopup from '@components/General/UnsupportedNetworkPopup';

export default (() => {
    const router = useRouter();
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardStep, setOnboardStep] = useState<number>(1);

    useEffect(() => {
        router.prefetch('/stakebpt');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <FarmStore farmContext="bptFarms">
                <NavBar setShowOnboardModal={setShowOnboardModal} />
                <StakeBPT />
            </FarmStore>
            <UnsupportedNetworkPopup />
            <Footer />
            <PendingCommits />

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

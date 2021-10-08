import React, { useEffect, useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';
import StakePool from '@archetypes/Stake/StakePool';
import PendingCommits from '@components/PendingCommits';
import OnboardStakeModal from '@components/OnboardModal/Stake';

export default (() => {
    const router = useRouter();

    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardStep, setOnboardStep] = useState<number>(1);

    useEffect(() => {
        if (localStorage.getItem('onboard.completedStakeTutorial') !== 'true') {
            const timeout = setTimeout(() => {
                setShowOnboardModal(true);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        router.prefetch('/stakepooltoken');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <NavBar setShowOnboardModal={setShowOnboardModal} />
            <FarmStore farmContext="poolFarms">
                <StakePool />
            </FarmStore>
            <Footer />
            <PendingCommits />

            <OnboardStakeModal
                onboardStep={onboardStep}
                setOnboardStep={setOnboardStep}
                showOnboardModal={showOnboardModal}
                setShowOnboardModal={() => {
                    setShowOnboardModal(false);
                    localStorage.setItem('onboard.completedStakeTutorial', 'true');
                    setTimeout(() => {
                        setOnboardStep(1);
                    }, 1000);
                }}
            />
        </div>
    );
}) as React.FC;

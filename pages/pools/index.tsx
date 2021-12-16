import React, { useEffect, useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { Browse } from '@archetypes/Pools';
import { PoolStore } from '@context/PoolContext';
import { useRouter } from 'next/router';
import { SwapStore } from '@context/SwapContext';
import OnboardTradeModal from '@components/OnboardModal/Trade';
import UnsupportedNetworkPopup from '@components/General/UnsupportedNetworkPopup';
import PendingCommits from '@components/PendingCommits';
import { WarningBanners } from '@components/WarningBanner';

export default (() => {
    const router = useRouter();
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardStep, setOnboardStep] = useState<number>(1);

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <NavBar setShowOnboardModal={setShowOnboardModal} />
                <WarningBanners banners={['auditWarning', 'decayWarning']} />
                <SwapStore>
                    <Browse />
                </SwapStore>
                <UnsupportedNetworkPopup />
                <PendingCommits />
            </PoolStore>
            <OnboardTradeModal
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
            <Footer />
        </div>
    );
}) as React.FC;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Browse } from '@archetypes/Pools';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import NavBar from '~/components/Nav/Navbar';
import OnboardTradeModal from '~/components/OnboardModal/Trade';
import { WarningBanners } from '~/components/WarningBanner';
import { PoolStore } from '~/context/PoolContext';
import { SwapStore } from '~/context/SwapContext';

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

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Browse } from '~/archetypes/Pools';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import NavBar from '~/components/Nav/Navbar';
import OnboardTradeModal from '~/components/OnboardModal/Trade';
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
            <NavBar setShowOnboardModal={setShowOnboardModal} />
            <SwapStore>
                <Browse />
            </SwapStore>
            <UnsupportedNetworkPopup />
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

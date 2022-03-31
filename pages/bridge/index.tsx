import React, { useState } from 'react';
import { ArbitrumBridge } from '~/archetypes/ArbitrumBridge';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import NavBar from '~/components/Nav/Navbar';
import OnboardTradeModal from '~/components/OnboardModal/Trade';
import { ArbitrumBridgeStore } from '~/context/ArbitrumBridgeContext';
import { PoolStore } from '~/context/PoolContext';

// const Bridge
export default (() => {
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardStep, setOnboardStep] = useState<number>(1);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <ArbitrumBridgeStore>
                    <NavBar setShowOnboardModal={setShowOnboardModal} />
                    <ArbitrumBridge />
                </ArbitrumBridgeStore>
                <UnsupportedNetworkPopup />
            </PoolStore>
            <Footer />

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
        </div>
    );
}) as React.FC;

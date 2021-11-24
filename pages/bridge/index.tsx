import React, { useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { PoolStore } from '@context/PoolContext';
import { ArbitrumBridge } from '@components/ArbitrumBridge';
import { ArbitrumBridgeStore } from '@context/ArbitrumBridgeContext';
import OnboardTradeModal from '@components/OnboardModal/Trade';

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

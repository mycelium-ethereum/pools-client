import React, { useEffect, useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { useRouter } from 'next/router';
import { PoolStore } from '@context/PoolContext';
import { SwapStore } from '@context/SwapContext';
import Exchange from '@archetypes/Exchange';
import { ArbitrumBridge } from '@components/ArbitrumBridge';
import { ArbitrumBridgeStore } from '@context/ArbitrumBridgeContext';
import OnboardTradeModal from '@components/OnboardModal/Trade';
import { DexStore } from '@context/1InchContext';

export default (() => {
    const router = useRouter();
    useEffect(() => {
        router.prefetch('/');
    }, []);

    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardStep, setOnboardStep] = useState<number>(1);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <ArbitrumBridgeStore>
                    <NavBar setShowOnboardModal={setShowOnboardModal} />
                    <SwapStore>
                        <DexStore>
                            <Exchange />
                        </DexStore>
                    </SwapStore>
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

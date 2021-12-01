import React, { useEffect, useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { Browse } from '@archetypes/Pools';
import { PoolStore } from '@context/PoolContext';
import { useRouter } from 'next/router';
import PendingCommits from '@components/PendingCommits';
import { ArbitrumBridge } from '@components/ArbitrumBridge';
import { ArbitrumBridgeStore} from '@context/ArbitrumBridgeContext';
import UnsupportedNetworkPopup from '@components/General/UnsupportedNetworkPopup';
import { SwapStore } from '@context/SwapContext';
import OnboardTradeModal from '@components/OnboardModal/Trade';

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
                <ArbitrumBridgeStore>
                    <NavBar />
                    <SwapStore>
                        <Browse />
                    </SwapStore>
                    <PendingCommits />
                    <ArbitrumBridge />
                    <UnsupportedNetworkPopup />
                </ArbitrumBridgeStore>
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

import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { Browse } from '@archetypes/Browse';
import { PoolStore } from '@context/PoolContext';
import { useRouter } from 'next/router';
import PendingCommits from '@components/PendingCommits';
import { ArbitrumBridge } from '@components/ArbitrumBridge';
import { ArbitrumBridgeStore } from '@context/ArbitrumBridgeContext';
import UnsupportedNetworkPopup from '@components/General/UnsupportedNetworkPopup';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <ArbitrumBridgeStore>
                    <NavBar />
                    <Browse />
                    <PendingCommits />
                    <ArbitrumBridge />
                    <UnsupportedNetworkPopup />
                </ArbitrumBridgeStore>
            </PoolStore>
            <Footer />
        </div>
    );
}) as React.FC;

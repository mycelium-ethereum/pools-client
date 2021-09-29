import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { Browse } from '@archetypes/Browse';
import { PoolStore } from '@context/PoolContext';
import { useRouter } from 'next/router';
import PendingCommits from '@components/PendingCommits';
import { ArbitrumBridge } from '@components/ArbitrumBridge';
import { ArbitrumBridgeStore } from '@context/ArbitrumBridgeContext';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <div className={`page relative bg-white`}>
            <PoolStore>
                <ArbitrumBridgeStore>
                    <NavBar />
                    <Browse />
                    <PendingCommits />
                    <ArbitrumBridge />
                </ArbitrumBridgeStore>
            </PoolStore>
            <Footer />
        </div>
    );
}) as React.FC;

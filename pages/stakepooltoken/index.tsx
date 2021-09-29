import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';
import StakePool from '@archetypes/Stake/StakePool';
import PendingCommits from '@components/PendingCommits';
import { ArbitrumBridge } from '@components/ArbitrumBridge';
import { ArbitrumBridgeStore } from '@context/ArbitrumBridgeContext';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stakepooltoken');
    }, []);

    return (
        <div className={`page relative bg-white`}>
            <ArbitrumBridgeStore>
                <NavBar />
                <FarmStore farmContext="poolFarms">
                    <StakePool />
                </FarmStore>
                <Footer />
                <PendingCommits />
                <ArbitrumBridge />
            </ArbitrumBridgeStore>
        </div>
    );
}) as React.FC;

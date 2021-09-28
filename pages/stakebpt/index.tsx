import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import StakeBPT from '@archetypes/Stake/StakeBPT';
import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';
import PendingCommits from '@components/PendingCommits';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stakebpt');
    }, []);

    return (
        <div className={`page relative`}>
            <FarmStore farmContext="bptFarms">
                <NavBar />
                <StakeBPT />
            </FarmStore>
            <Footer />
            <PendingCommits />
        </div>
    );
}) as React.FC;

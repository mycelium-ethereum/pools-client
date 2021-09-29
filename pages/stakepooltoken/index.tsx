import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';
import StakePool from '@archetypes/Stake/StakePool';
import PendingCommits from '@components/PendingCommits';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stakepooltoken');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <NavBar />
            <FarmStore farmContext="poolFarms">
                <StakePool />
            </FarmStore>
            <Footer />
            <PendingCommits />
        </div>
    );
}) as React.FC;

import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { PoolStore } from '@context/PoolContext';
import { SwapStore } from '@context/SwapContext';
import { useRouter } from 'next/router';
import Exchange from '@archetypes/Exchange';
import InvestNav from '@components/Nav/InvestNav';
import PendingCommits from '@components/PendingCommits';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/browse');
    }, []);

    return (
        <div className={`page relative`}>
            <PoolStore>
                <NavBar />
                <InvestNav />
                <SwapStore>
                    <Exchange />
                </SwapStore>
                <PendingCommits />
            </PoolStore>
            <Footer />
            <iframe src="https://vyps-kit.reputation.vercel.app/" />
        </div>
    );
}) as React.FC;

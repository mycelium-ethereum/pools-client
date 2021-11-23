import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { useRouter } from 'next/router';
import { PoolStore } from '@context/PoolContext';
import { SwapStore } from '@context/SwapContext';
import BalancerBuySell from '@archetypes/BalancerBuySell';

export default (() => {
    const router = useRouter();
    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <SwapStore>
                    <NavBar />
                    <BalancerBuySell />
                </SwapStore>
            </PoolStore>
            <Footer />
        </div>
    );
}) as React.FC;

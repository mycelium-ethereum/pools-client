import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Portfolio, { TradePortfolioPage } from '~/archetypes/Portfolio';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import NavBar from '~/components/Nav/Navbar';
import { SwapStore } from '~/context/SwapContext';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <>
            <div className={`page relative pb-10 matrix:bg-matrix-bg`}>
                <NavBar />
                <SwapStore>
                    <Portfolio page={TradePortfolioPage.Overview} />
                </SwapStore>
                <UnsupportedNetworkPopup />
            </div>
            <Footer />
        </>
    );
}) as React.FC;

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Portfolio, { TradePortfolioPage } from '@archetypes/Portfolio';
import Footer from '@components/Footer';
import UnsupportedNetworkPopup from '@components/General/UnsupportedNetworkPopup';
import NavBar from '@components/Nav/Navbar';
import { WarningBanners } from '@components/WarningBanner';
import { PoolStore } from '@context/PoolContext';
import { SwapStore } from '@context/SwapContext';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <NavBar />
                <WarningBanners banners={['auditWarning', 'decayWarning']} />
                <SwapStore>
                    <Portfolio page={TradePortfolioPage.Overview} />
                </SwapStore>
                <UnsupportedNetworkPopup />
            </PoolStore>
            <Footer />
        </div>
    );
}) as React.FC;

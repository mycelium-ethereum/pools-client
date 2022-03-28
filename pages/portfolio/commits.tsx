import React from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import Portfolio, { TradePortfolioPage } from '@archetypes/Portfolio';
import { PoolStore } from '@context/PoolContext';
import UnsupportedNetworkPopup from '@components/General/UnsupportedNetworkPopup';

export default (() => {
    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <NavBar />
                <Portfolio page={TradePortfolioPage.Queued} />
                <UnsupportedNetworkPopup />
            </PoolStore>
            <Footer />
        </div>
    );
}) as React.FC;

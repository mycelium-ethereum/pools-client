import React from 'react';
import Portfolio, { TradePortfolioPage } from '~/archetypes/Portfolio';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import NavBar from '~/components/Nav/Navbar';

export default (() => {
    return (
        <>
            <div className={`page relative matrix:bg-matrix-bg`}>
                <NavBar />
                <Portfolio page={TradePortfolioPage.Queued} />
                <UnsupportedNetworkPopup />
            </div>
            <Footer />
        </>
    );
}) as React.FC;

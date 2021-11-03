import React from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import Portfolio, { TradePortfolioPage } from '@archetypes/Portfolio';
import { PoolStore } from '@context/PoolContext';
import PendingCommits from '@components/PendingCommits';
import { ArbitrumBridge } from '@components/ArbitrumBridge';
import { ArbitrumBridgeStore } from '@context/ArbitrumBridgeContext';
import UnsupportedNetworkPopup from '@components/General/UnsupportedNetworkPopup';

export default (() => {
    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <ArbitrumBridgeStore>
                    <NavBar />
                    <Portfolio page={TradePortfolioPage.Queued} />
                    <PendingCommits />
                    <ArbitrumBridge />
                    <UnsupportedNetworkPopup />
                </ArbitrumBridgeStore>
            </PoolStore>
            <Footer />
        </div>
    );
}) as React.FC;

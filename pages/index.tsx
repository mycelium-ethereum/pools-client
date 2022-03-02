import React from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { PoolStore } from '@context/PoolContext';
import { SwapStore } from '@context/SwapContext';
import PendingCommits from '@components/PendingCommits';
// @ts-ignore
import { SecurityWidget } from '@mycelium-ethereum/vyps-kit';
import UnsupportedNetworkPopup from '@components/General/UnsupportedNetworkPopup';
import { WarningBanners } from '@components/WarningBanner';
import BalancerBuySell from '@archetypes/BalancerBuySell';

export default (() => {
    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <NavBar />
                <WarningBanners banners={['auditWarning', 'decayWarning']} />
                <SwapStore>
                    <BalancerBuySell />
                </SwapStore>
                <UnsupportedNetworkPopup />
                <PendingCommits />
            </PoolStore>
            <Footer />
            <CorWidget />
        </div>
    );
}) as React.FC;

const CorWidget: React.FC = () => (
    <div id="cor-widget">
        <SecurityWidget
            right
            color={'#3E58C9'}
            textColor={'#ffffff'}
            url={'https://reputation.link/protocols/tracer/?network=Arbitrum'}
        />
        <style>
            {`
            #cor-widget a {
                background: rgba(87, 113, 226)!important;
            }
            @media (max-width: 1024px) {
                #cor-widget div {
                    bottom: 20px!important;
                }
            }
            @media (min-width: 1024px) {
                #cor-widget div {
                    bottom: 60px!important;
                }
            }
        `}
        </style>
    </div>
);

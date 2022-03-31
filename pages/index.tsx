import React from 'react';
import { SecurityWidget } from '@reputation.link/vyps-kit';
import BalancerBuySell from '@archetypes/BalancerBuySell';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import NavBar from '~/components/Nav/Navbar';
import { WarningBanners } from '~/components/WarningBanner';
import { PoolStore } from '~/context/PoolContext';
import { SwapStore } from '~/context/SwapContext';

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
            </PoolStore>
            <Footer />
            <CorWidget />
        </div>
    );
}) as React.FC;

const CorWidget: React.FC = () => (
    <div id="cor-widget">
        {typeof window !== 'undefined' && (
            <SecurityWidget
                right
                color={'#3E58C9'}
                textColor={'#ffffff'}
                variant={'sm'}
                protocol={'tracer'}
                network={'Arbitrum'}
            />
        )}
    </div>
);

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import { UserSnap } from '~/components/General/Usersnap';
import { GeoblockModal } from '~/components/GeoblockModal';
import NavBar from '~/components/Nav/Navbar';
import OnboardTradeModal from '~/components/OnboardModal/Trade';
import { AnalyticsProvider } from '~/context/AnalyticsContext';

export const Layout: React.FC = ({ children }) => {
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardStep, setOnboardStep] = useState<number>(1);

    return (
        <div className={`page matrix:bg-matrix-bg dark:bg-mesh-bg`}>
            <UserSnap />
            <NavBar />
            <AnalyticsProvider>{children}</AnalyticsProvider>
            <UnsupportedNetworkPopup />
            <GeoblockModal />
            <OnboardTradeModal
                onboardStep={onboardStep}
                setOnboardStep={setOnboardStep}
                showOnboardModal={showOnboardModal}
                setShowOnboardModal={() => {
                    setShowOnboardModal(false);
                    setTimeout(() => {
                        setOnboardStep(1);
                    }, 1000);
                }}
            />
            <Footer setShowOnboardModal={useRouter().pathname !== '/portfolio' ? setShowOnboardModal : undefined} />
        </div>
    );
};

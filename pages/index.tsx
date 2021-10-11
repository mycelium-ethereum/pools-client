import React, { useEffect, useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { PoolStore } from '@context/PoolContext';
import { SwapStore } from '@context/SwapContext';
import { useRouter } from 'next/router';
import Exchange from '@archetypes/Exchange';
import InvestNav from '@components/Nav/InvestNav';
import PendingCommits from '@components/PendingCommits';
// @ts-ignore
import { SecurityWidget } from 'vyps-kit';
import { ArbitrumBridge } from '@components/ArbitrumBridge';
import { ArbitrumBridgeStore } from '@context/ArbitrumBridgeContext';
import OnboardTradeModal from '@components/OnboardModal/Trade';

export default (() => {
    const router = useRouter();

    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardStep, setOnboardStep] = useState<number>(1);

    useEffect(() => {
        if (localStorage.getItem('onboard.completedTradeTutorial') !== 'true') {
            const timeout = setTimeout(() => {
                setShowOnboardModal(true);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        router.prefetch('/browse');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <ArbitrumBridgeStore>
                    <NavBar />
                    <InvestNav />
                    <SwapStore>
                        <Exchange />
                    </SwapStore>
                    <PendingCommits />
                    <ArbitrumBridge />
                </ArbitrumBridgeStore>
            </PoolStore>
            <Footer />
            <CorWidget />

            <OnboardTradeModal
                onboardStep={onboardStep}
                setOnboardStep={setOnboardStep}
                showOnboardModal={showOnboardModal}
                setShowOnboardModal={() => {
                    setShowOnboardModal(false);
                    localStorage.setItem('onboard.completedTradeTutorial', 'true');
                    setTimeout(() => {
                        setOnboardStep(1);
                    }, 1000);
                }}
            />
        </div>
    );
}) as React.FC;

const CorWidget: React.FC = () => (
    <div id="cor-widget">
        <SecurityWidget
            right
            color={'#3E58C9'}
            textColor={'#ffffff'}
            url={'https://beta.reputation.link/protocols/tracer/?network=Arbitrum'}
        />
        <style>{`
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
        `}</style>
    </div>
);

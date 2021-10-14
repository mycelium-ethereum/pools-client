import React, { useEffect, useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { PoolStore } from '@context/PoolContext';
import { SwapStore } from '@context/SwapContext';
import Exchange from '@archetypes/Exchange';
import PendingCommits from '@components/PendingCommits';
// @ts-ignore
import { SecurityWidget } from 'vyps-kit';
import OnboardTradeModal from '@components/OnboardModal/Trade';

export default (() => {
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

    return (
        <div className={`page relative matrix:bg-matrix-bg`}>
            <PoolStore>
                <NavBar setShowOnboardModal={setShowOnboardModal} />
                <SwapStore>
                    <Exchange />
                </SwapStore>
                <PendingCommits />
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

const CorWidget: React.FC = () => {

    useEffect(() => {
        let timeout: any;
        if (!localStorage.getItem('animatedCorWidget')) {
            timeout = setTimeout(() => {
                // hacky solution since there is no selector on the element itself
                const widget = document.getElementById('cor-widget')?.children[0]?.children[0];
                let event = new MouseEvent('mouseenter', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                widget?.dispatchEvent(event)
                timeout = setTimeout(() => {
                    let event = new MouseEvent('mouseleave', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': true
                    });
                    widget?.dispatchEvent(event)
                    localStorage.setItem('animatedCorWidget', 'true');
                }, 4000)
            }, 4000)
        }
        return (() => {
            if (timeout) {
                clearTimeout(timeout)
            }
        })
    }, [])

    return (
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
    )
};

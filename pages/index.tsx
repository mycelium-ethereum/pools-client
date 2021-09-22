import React, { useEffect } from 'react';
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

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/browse');
    }, []);

    return (
        <div className={`page relative`}>
            <PoolStore>
                <NavBar />
                <InvestNav />
                <SwapStore>
                    <Exchange />
                </SwapStore>
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

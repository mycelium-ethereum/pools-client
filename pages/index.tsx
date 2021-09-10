import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { PoolStore } from '@context/PoolContext';
import { SwapStore } from '@context/SwapContext';
import { useRouter } from 'next/router';
import Exchange from '@archetypes/Exchange';
import InvestNav from '@components/Nav/InvestNav';
import PendingCommits from '@components/PendingCommits';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/browse');
    }, []);

    return (
        <Page className={`page`}>
            <SwapStore>
                <PoolStore>
                    <NavBar />
                    <InvestNav />
                    <Exchange />
                    <PendingCommits />
                </PoolStore>
            </SwapStore>
            <Footer />
        </Page>
    );
}) as React.FC;

const Page = styled.div`
    position: relative;
    background: var(--color-background);
`;

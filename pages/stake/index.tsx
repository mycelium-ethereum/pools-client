import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import StakePool from '@archetypes/Stake/StakePool';
import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stake');
    }, []);

    return (
        <Page className={`page`}>
            <FarmStore>
                <NavBar />
                <StakePool />
                <Footer />
            </FarmStore>
        </Page>
    );
}) as React.FC;

const Page = styled.div`
    position: relative;
    background: var(--color-background);
`;
//still to do: stake context + archetypes -> fills out the table

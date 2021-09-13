import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import StakePool from '@archetypes/Stake/StakePool';
import { StakePoolStore } from '@context/StakeContext';
import { useRouter } from 'next/router';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stake');
    }, []);

    return (
        <Page className={`page`}>
            <StakePoolStore>
                <NavBar />
                <StakePool />
            </StakePoolStore>
            <Footer />
        </Page>
    );
}) as React.FC;

const Page = styled.div`
    position: relative;
    background: var(--color-background);
`;
//still to do: stake context + archetypes -> fills out the table

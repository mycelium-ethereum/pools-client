import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import StakeSLP  from '@archetypes/Stake/StakeSLP';
import { StakePoolStore } from '@context/StakeContext';
import { useRouter } from 'next/router';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/slp');
    }, []);

    return (
        <Page className={`page`}>
            <StakePoolStore>
                <NavBar />
                <StakeSLP />
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

import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';
import StakePool from '@archetypes/Stake/StakePool';
import PendingCommits from '@components/PendingCommits';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stake');
    }, []);

    return (
        <Page className={`page`}>
            <NavBar />
            <FarmStore farmContext="poolFarms">
                <StakePool />
            </FarmStore>
            <Footer />
            <PendingCommits />
        </Page>
    );
}) as React.FC;

const Page = styled.div`
    position: relative;
    background: var(--color-background);
`;
//still to do: stake context + archetypes -> fills out the table

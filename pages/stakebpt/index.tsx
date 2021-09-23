import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import StakeBPT from '@archetypes/Stake/StakeBPT';
import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';
import PendingCommits from '@components/PendingCommits';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stakebpt');
    }, []);

    return (
        <Page className={`page`}>
            <FarmStore farmContext="bptFarms">
                <NavBar />
                <StakeBPT />
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

import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { Browse } from '@archetypes/Browse';
import { PoolStore } from '@context/PoolContext';
import { useRouter } from 'next/router';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <Page className={`page`}>
            <PoolStore>
                <NavBar />
                <Browse />
            </PoolStore>
            <Footer />
        </Page>
    );
}) as React.FC;

const Page = styled.div`
    position: relative;
    background: var(--color-background);
`;

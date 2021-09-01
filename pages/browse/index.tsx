import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { Browse } from '@archetypes/Browse';
import { PoolStore } from '@context/PoolContext';
import { useRouter } from 'next/router';
import InvestNav from '@components/Nav/InvestNav';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <Page className={`page`}>
            <PoolStore>
                <NavBar />
                <InvestNav />
                <Container className="container">
                    <Browse />
                </Container>
            </PoolStore>
            <Footer />
        </Page>
    );
}) as React.FC;

const Page = styled.div`
    position: relative;
    background: var(--color-background);
`;

const Container = styled.div`
    display: flex;
    .side-nav {
        width: 20vw;
    }
`;

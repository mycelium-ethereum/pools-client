import React, { useEffect } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';

import SideNav from '@components/Nav/SideNav';
import { Browse } from '@archetypes/Browse';
import { PoolStore } from '@context/PoolContext';
import { useRouter } from 'next/router';

const EXCHANGE = 0;
const BROWSE = 1;

export default (() => {
    const router = useRouter();

    const setPage = (index: number) => {
        if (index === EXCHANGE) {
            router.push({
                pathname: '/',
            });
        } // else do nothing
    };
    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <Page className={`page`}>
            <NavBar />
            <PoolStore>
                <Container className="container">
                    <SideNav className="side-nav" selected={BROWSE} setTab={setPage} tabs={['Exchange', 'Browse']} />
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

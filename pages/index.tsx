import React, { useState } from 'react';
import styled from 'styled-components';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';

import SideNav from '@components/Nav/SideNav';
import { Browse } from '@archetypes/Browse';
import Excahnge from '@archetypes/Exchange';
import { PoolStore } from '@context/PoolContext';

const EXCHANGE = 0;
const BROWSE = 1;

export default (() => {
    const [page, setPage] = useState(EXCHANGE);

    return (
        <Page className={`page`}>
            <NavBar />
            <PoolStore>
                <Container className="container">
                    <SideNav className="side-nav" selected={page} setTab={setPage} tabs={['Exchange', 'Browse']} />
                    {page === BROWSE ? <Browse /> : <Excahnge />}
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

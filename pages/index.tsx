import React from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import Footer from '@components/Footer';
import { Browse } from '@archetypes/Browse';
import { SwapStore } from '@context/SwapContext';

const Insurance: React.FC = styled(({ className }) => {
    return (
        <div className={`${className} page`}>
            <NavBar />
            <SwapStore>
                <Browse />
            </SwapStore>
            <Footer />
        </div>
    );
})`
    position: relative;
    background: var(--color-background);
`;

export default Insurance;

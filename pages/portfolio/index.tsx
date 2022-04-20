import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useResizeDetector } from 'react-resize-detector';
import Portfolio from '~/archetypes/Portfolio';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import NavBar from '~/components/Nav/Navbar';
import { SwapStore } from '~/context/SwapContext';

export default (() => {
    const router = useRouter();

    const onResize = useCallback((_width, height) => {
        if (height > window.innerHeight * 2) {
            const page = document.getElementsByClassName('page')[0];
            page.classList.add('faded-background');
        }
    }, []);

    const { ref } = useResizeDetector({ onResize, handleWidth: false });

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <div className={`page relative matrix:bg-matrix-bg`} ref={ref}>
            <NavBar />
            <SwapStore>
                <Portfolio />
            </SwapStore>
            <UnsupportedNetworkPopup />
            <Footer />
        </div>
    );
}) as React.FC;

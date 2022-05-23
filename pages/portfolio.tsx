import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useResizeDetector } from 'react-resize-detector';
import Portfolio from '~/archetypes/Portfolio';
import Footer from '~/components/Footer';
import UnsupportedNetworkPopup from '~/components/General/UnsupportedNetworkPopup';
import NavBar from '~/components/Nav/Navbar';
import { FarmStore } from '~/context/FarmContext';
import { SwapStore } from '~/context/SwapContext';

export default (() => {
    const router = useRouter();

    const onResize = useCallback((_width, height) => {
        const page = document.getElementsByClassName('page')[0];
        if (height >= window.innerHeight * 2) {
            page.classList.add('faded-background');
        } else {
            page.classList.remove('faded-background');
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
                <FarmStore>
                    <Portfolio />
                </FarmStore>
            </SwapStore>
            <UnsupportedNetworkPopup />
            <Footer />
        </div>
    );
}) as React.FC;

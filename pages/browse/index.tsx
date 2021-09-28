import React, { useEffect } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { Browse } from '@archetypes/Browse';
import { PoolStore } from '@context/PoolContext';
import { useRouter } from 'next/router';
import PendingCommits from '@components/PendingCommits';

export default (() => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/');
    }, []);

    return (
        <div className={`page relative bg-white`}>
            <PoolStore>
                <NavBar />
                <Browse />
                <PendingCommits />
            </PoolStore>
            <Footer />
        </div>
    );
}) as React.FC;

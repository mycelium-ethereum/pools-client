import React, { useMemo } from 'react';
import NavBar from '@components/Nav/Navbar';
import Footer from '@components/Footer';
import { FarmStore } from '@context/FarmContext';
import { useRouter } from 'next/router';
import { PoolStore } from '@context/PoolContext';
import StakePool from '@archetypes/Stake/StakePool';
import PendingCommits from '@components/PendingCommits';
import StakeSLP from '@archetypes/Stake/StakeSLP';

export default (() => {
    const router = useRouter();
    const path = useMemo(() => router.asPath.split('/')[2], [router.asPath]);

    return (
        <div className={`page relative`}>
            <PoolStore>
                <FarmStore>
                    <NavBar />
                    {path === 'pool' ? <StakePool /> : <StakeSLP />}
                </FarmStore>
                <Footer />
                <PendingCommits />
            </PoolStore>
        </div>
    );
}) as React.FC;

import React from 'react';
import { useRouter } from 'next/router';
import StakePool from '~/archetypes/Stake/StakePool';
import SEO from '~/components/General/SEO';
import { PagePath, seoContent } from '~/constants/seo';
import { FarmStore } from '~/context/FarmContext';

export default (() => {
    const router = useRouter();

    return (
        <FarmStore>
            <SEO {...seoContent[router.pathname as PagePath]} />
            <StakePool />
        </FarmStore>
    );
}) as React.FC;

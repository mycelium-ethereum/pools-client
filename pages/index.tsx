import React from 'react';
import { useRouter } from 'next/router';
import Portfolio from '~/archetypes/Portfolio';
import SEO from '~/components/General/SEO';
import { PagePath, seoContent } from '~/constants/seo';
import { SwapStore } from '~/context/SwapContext';
import { FarmStore } from '~/context/FarmContext';

export default (() => {
    const router = useRouter();

    return (
        <SwapStore>
            <SEO {...seoContent[router.pathname as PagePath]} />
            <FarmStore>
                <Portfolio />
            </FarmStore>
        </SwapStore>
    );
}) as React.FC;

import React from 'react';
import { useRouter } from 'next/router';
import TokenBuySell from '~/archetypes/BuyTokens';
import SEO from '~/components/General/SEO';
import { PagePath, seoContent } from '~/constants/seo';
import { SwapStore } from '~/context/SwapContext';

export default (() => {
    const router = useRouter();

    return (
        <SwapStore>
            <SEO {...seoContent[router.pathname as PagePath]} />
            <TokenBuySell />
        </SwapStore>
    );
}) as React.FC;

import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const USERSNAP_GLOBAL_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_GLOBAL_API_KEY;
const USERSNAP_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_API_KEY;

export type SEOProps = {
    title: string;
    image?: string;
    description?: string;
};

const SEO: React.FC<SEOProps> = ({ title, image, description }) => {
    const router = useRouter();
    const pathname = router.pathname;
    const metaDescription = description || process.env.siteDescription;
    const keywords = process.env.siteKeywords;
    const siteURL = process.env.siteUrl;
    const imagePreview = image || `${siteURL}/${process.env.siteImagePreviewUrl}`;
    const metaTitle = title ? `${title} | ${process.env.siteTitle}` : process.env.siteTitle;

    useEffect(() => {
        // Load usersnap
        (window as any).onUsersnapCXLoad = function (api: any) {
            (window as any).Usersnap = api;
            api.init();
            api.show(USERSNAP_API_KEY);
        };
    }, []);

    return (
        <Head>
            {/* <!-- HTML Meta Tags --> */}
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, user-scalable=no" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="keywords" content={keywords} />
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content="Tracer, DeFi, Bitcoin, Crypto, Exchange, Governance, DAO, Protocol" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />

            {/* Open Graph */}
            <meta property="og:url" content={`${siteURL}${pathname}`} key="ogurl" />
            <meta property="og:title" content={metaTitle} key="ogtitle" />
            <meta property="og:image" content={imagePreview} key="ogimage" />
            <meta property="og:site_name" content={siteURL} key="ogsitename" />
            <meta property="og:description" content={metaDescription} key="ogdesc" />
            <meta property="og:type" content="website" />

            {/* <!-- Facebook Meta Tags --> */}
            <meta property="og:url" content={`${siteURL}${pathname}`} />

            {/* <!-- Twitter Meta Tags --> */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="pools.tracer.finance" />
            <meta property="twitter:url" content={siteURL} />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={imagePreview} />

            {/* Android Chrome tab theme colour */}
            <meta name="theme-color" content="#0000B0" />

            {/* Favicon */}
            <link rel="shortcut icon" type="image/svg" href="/favicon.svg" />

            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap"
                rel="stylesheet"
            />

            {/* Aileron Typekit */}
            <link rel="stylesheet" href="https://use.typekit.net/klm0viv.css" />

            {/* Analytics scripts */}
            <script
                async
                src={`https://widget.usersnap.com/global/load/${USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad`}
            />
            <script defer data-domain="pools.tracer.finance" src="https://plausible.io/js/plausible.js" />

            <title>{metaTitle}</title>
        </Head>
    );
};

export default SEO;

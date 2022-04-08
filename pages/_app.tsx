// prevent creating full trace
process.traceDeprecation = true;

import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/index.css';
import { ToastContainerWithStyles } from '~/components/General/Notification/ToastContainerWithStyles';
import StoreUpdater from '~/components/StoreUpdater';
import { StyledThemeProvider } from '~/context/ThemeContext';

const USERSNAP_GLOBAL_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_GLOBAL_API_KEY;
const USERSNAP_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_API_KEY;

const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
    // load usersnap
    useEffect(() => {
        (window as any).onUsersnapCXLoad = function (api: any) {
            (window as any).Usersnap = api;
            api.init();
            api.show(USERSNAP_API_KEY);
        };
    }, []);

    return (
        <div>
            <Head>
                {/** Meta tags */}
                <title>Tracer | Perpetual Pools </title>
                <meta
                    name="description"
                    content="Build and trade with Tracer Perpetuals and gain leveraged exposure to any market in the world."
                />
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link rel="shortcut icon" type="image/svg" href="/favicon.svg" />
                <meta name="keywords" content="Tracer, DeFi, Bitcoin, Crypto, Exchange, Governance, DAO, Protocol" />
                <meta name="robots" content="index, follow" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="language" content="English" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />

                {/** Color for Chrome tabs (Android only) */}
                <meta name="theme-color" content="#000240" />

                <script
                    async
                    src={`https://widget.usersnap.com/global/load/${USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad`}
                />
                <script />
                <script defer data-domain="pools.tracer.finance" src="https://plausible.io/js/plausible.js" />
                <link rel="stylesheet" href="https://use.typekit.net/klm0viv.css" />
            </Head>
            <StoreUpdater />
            <StyledThemeProvider>
                <Component {...pageProps} />
                <ToastContainerWithStyles />
            </StyledThemeProvider>
        </div>
    );
};

export default App;

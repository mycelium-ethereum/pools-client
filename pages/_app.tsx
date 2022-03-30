// prevent creating full trace
process.traceDeprecation = true;

import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/index.css';
import { ToastContainerWithStyles } from '@components/General/Notification/ToastContainerWithStyles';
import { Web3Store } from '@context/Web3Context/Web3Context';
import { UsersCommitStore } from '@context/UsersCommitContext';
import { StyledThemeProvider } from '@context/ThemeContext';

const USERSNAP_GLOBAL_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_GLOBAL_API_KEY;
const USERSNAP_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_API_KEY;

const App = ({ Component, pageProps }: AppProps) => { // eslint-disable-line
    // load usersnap
    useEffect(() => {
        // @ts-ignore
        window.onUsersnapCXLoad = function (api) {
            // @ts-ignore
            window.Usersnap = api;
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
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap"
                />

                {/** Color for Chrome tabs (Android only) */}
                <meta name="theme-color" content="#000240" />

                <script
                    async
                    src={`https://widget.usersnap.com/global/load/${USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad`}
                />
                <script defer data-domain="pools.tracer.finance" src="https://plausible.io/js/plausible.js" />
            </Head>
            <StyledThemeProvider>
                <Web3Store>
                    <UsersCommitStore>
                        <Component {...pageProps} />
                    </UsersCommitStore>
                </Web3Store>
                <ToastContainerWithStyles />
            </StyledThemeProvider>
        </div>
    );
};

export default App;

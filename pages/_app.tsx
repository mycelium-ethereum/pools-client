// prevent creating full trace
process.traceDeprecation = true;

import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/index.css';
import { ToastProvider } from 'react-toast-notifications';
import { Notification } from '@components/General/Notification';
import { TransactionStore } from '@context/TransactionContext';
import { FactoryStore } from '@context/FactoryContext';
import GlobalStyles from 'styles/GlobalStyles';
import styled from 'styled-components';
import { Web3Store } from '@context/Web3Context/Web3Context';
import { FilterStore } from '@context/FilterContext';

const Desktop = styled.div`
    display: block;
    @media (max-width: 1024px) {
        display: none;
    }
`;

const Mobile = styled.div`
    display: none;
    padding-top: 10vh;
    padding-left: 10vw;
    height: 100%;
    background: var(--color-background);
    color: var(--color-text);
    @media (max-width: 1024px) {
        display: block;
    }
    > h1 {
        font-size: 55px;
        font-weight: lighter;
    }
`;

const App = ({ Component, pageProps }: AppProps) => { // eslint-disable-line
    return (
        <div>
            <Head>
                {/** Meta tags */}
                <title>Tracer | Perpetual Swaps </title>
                <meta
                    name="description"
                    content="Build and trade with Tracer’s Perpetual Swaps and gain leveraged exposure to any market in the world. "
                />
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link rel="shortcut icon" type="image/svg" href="/favicon.svg" />
                <meta name="keywords" content="Tracer, DeFi, Bitcoin, Crypto, Exchange, Governance, DAO, Protocol" />
                <meta name="robots" content="index, follow" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="language" content="English" />

                {/** Color for Chrome tabs (Android only) */}
                <meta name="theme-color" content="#000240" />
            </Head>
            <GlobalStyles />
            {/* <Desktop> */}
                <ToastProvider components={{ Toast: Notification }}>
                    <Web3Store
                        networkIds={[42, 421611]}
                        onboardConfig={{
                            hideBranding: true,
                            walletSelect: {
                                heading: 'Connect Wallet',
                                wallets: [
                                    { walletName: 'metamask' },
                                    { walletName: 'coinbase' },
                                    { walletName: 'torus' },
                                    // { walletName: "binance" },

                                    // {
                                    //     walletName: "walletConnect",
                                    //     infuraKey: INFURA_KEY
                                    // },
                                ],
                                // agreement: {
                                //     version: '1.0',
                                //     termsUrl: 'https://google.com',
                                // },
                            },
                        }}
                    >
                        <FactoryStore>
                            <FilterStore>
                                <TransactionStore>
                                    <Component {...pageProps} />
                                </TransactionStore>
                            </FilterStore>
                        </FactoryStore>
                    </Web3Store>
                </ToastProvider>
            {/* </Desktop> */}
            {/* <Mobile>
                <h1>Mobile coming soon.</h1>
                <p>
                    Alpha testing is available on desktop only. <br />
                    Switch to desktop to conduct testing.
                </p>
            </Mobile> */}
        </div>
    );
};

export default App;

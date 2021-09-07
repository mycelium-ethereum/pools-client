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
import { Web3Store } from '@context/Web3Context/Web3Context';
import { UsersCommitStore } from '@context/UsersCommitContext';

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
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source%20Sans%20Pro" />

                {/** Color for Chrome tabs (Android only) */}
                <meta name="theme-color" content="#000240" />
            </Head>
            <GlobalStyles />
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
                        <TransactionStore>
                            <UsersCommitStore>
                                <Component {...pageProps} />
                            </UsersCommitStore>
                        </TransactionStore>
                    </FactoryStore>
                </Web3Store>
            </ToastProvider>
        </div>
    );
};

export default App;

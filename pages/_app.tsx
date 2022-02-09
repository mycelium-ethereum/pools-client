// prevent creating full trace
process.traceDeprecation = true;

import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import 'antd/dist/antd.css';
import '../styles/index.css';
import { ToastProvider } from 'react-toast-notifications';
import { Notification } from '@components/General/Notification';
import { TransactionStore } from '@context/TransactionContext';
import { Web3Store } from '@context/Web3Context/Web3Context';
import { UsersCommitStore } from '@context/UsersCommitContext';
import { ThemeStore } from '@context/ThemeContext';
import { ARBITRUM, ARBITRUM_RINKEBY, MAINNET } from '@libs/constants';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';

const USERSNAP_GLOBAL_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_GLOBAL_API_KEY;
const USERSNAP_API_KEY = process.env.NEXT_PUBLIC_USERSNAP_API_KEY;

const App = ({ Component, pageProps }: AppProps) => { // eslint-disable-line
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

            <ToastProvider components={{ Toast: Notification }}>
                <ThemeStore>
                    <Web3Store
                        onboardConfig={{
                            hideBranding: true,
                            walletSelect: {
                                heading: 'Connect Wallet',
                                wallets: [
                                    { walletName: 'metamask' },
                                    { walletName: 'coinbase' },
                                    { walletName: 'torus' },
                                    // { walletName: "binance" },

                                    {
                                        walletName: 'walletConnect',
                                        rpc: {
                                            [ARBITRUM]: networkConfig[ARBITRUM].publicRPC,
                                            [ARBITRUM_RINKEBY]: networkConfig[ARBITRUM_RINKEBY].publicRPC,
                                            [MAINNET]: networkConfig[MAINNET].publicRPC,
                                        },
                                    },
                                ],
                                // agreement: {
                                //     version: '1.0',
                                //     termsUrl: 'https://google.com',
                                // },
                            },
                        }}
                    >
                        <TransactionStore>
                            <UsersCommitStore>
                                <Component {...pageProps} />
                            </UsersCommitStore>
                        </TransactionStore>
                    </Web3Store>
                </ThemeStore>
            </ToastProvider>
        </div>
    );
};

export default App;

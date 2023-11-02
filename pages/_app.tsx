// prevent creating full trace
process.traceDeprecation = true;

import 'antd/dist/antd.css';
import { AppProps } from 'next/app';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from '~/components/General/Layout';
import { ToastContainerWithStyles } from '~/components/General/Notification/ToastContainerWithStyles';
import StoreUpdater from '~/components/StoreUpdater';
import { StyledThemeProvider } from '~/context/ThemeContext';
import '../styles/index.css';
// import { Banner, BannerTitle, BannerContent } from '~/components/Banner/Banner';

const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
    return (
        <div>
            <StoreUpdater />
            <StyledThemeProvider>
                {/* <div className="fixed top-0 left-0 z-50 w-full bg-yellow-400 py-3 text-center font-bold text-black">
                    Please read &nbsp;
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://mycelium.xyz/blog/the-future-of-mycelium"
                        className="inline underline"
                    >
                        this blog post
                    </a>
                    , and close your positions.
                </div>
                <div className="h-16 min-h-[48px] sm:h-[48px]" /> */}
                <Layout>
                    {/* <div style={{ display: 'flex', justifyContent: 'center', margin: '16px' }}>
                        <Banner>
                            <BannerTitle>ARBITRUM NITRO UPGRADE IN PROGRESS</BannerTitle>
                            <BannerContent>
                                The Arbitrum Network is expected to have 2-4 hours of downtime as it makes its upgrade
                                to Nitro. Trades may not go through during this period.
                            </BannerContent>
                        </Banner>
                    </div> */}
                    <Component {...pageProps} />
                </Layout>
                <ToastContainerWithStyles />
            </StyledThemeProvider>
        </div>
    );
};

export default App;

// prevent creating full trace
process.traceDeprecation = true;

import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import '../styles/index.css';
import { Layout } from '~/components/General/Layout';
import { ToastContainerWithStyles } from '~/components/General/Notification/ToastContainerWithStyles';
import StoreUpdater from '~/components/StoreUpdater';
import { StyledThemeProvider } from '~/context/ThemeContext';
import { Banner, BannerTitle, BannerContent } from '~/components/Banner/Banner';

const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
    return (
        <div>
            <StoreUpdater />
            <StyledThemeProvider>
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

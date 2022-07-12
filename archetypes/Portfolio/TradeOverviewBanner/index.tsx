import React from 'react';
import { NetworkHintContainer, NetworkHint } from '~/components/NetworkHint';
import { Heading } from '~/components/PageTable';
import { PortfolioOverview } from '~/types/portfolio';
import { toApproxLocaleString } from '~/utils/converters';
import * as Styles from './styles';
import { ConnectWalletBanner } from '../ConnectWalletBanner';

type BannerTypes = {
    title: string;
    account: boolean;
    portfolioOverview: PortfolioOverview;
    handleConnect?: () => void;
};

export const DENOTATION_FILTER_OPTIONS = [{ key: 'USD', value: 'USD' }];

export const TIME_FILTER_OPTIONS = [{ key: 'All Time', value: 'All Time' }];

export const TradeOverviewBanner: React.FC<BannerTypes> = ({ title, account, portfolioOverview, handleConnect }) => {
    const { totalPortfolioValue } = portfolioOverview;

    return (
        <>
            <Heading>
                <NetworkHintContainer>
                    {title}
                    <NetworkHint />
                </NetworkHintContainer>
            </Heading>
            <Styles.Container>
                <Styles.Banner className={!!account ? '' : 'empty-state'}>
                    <Styles.Header>
                        <Styles.Subtitle>Valuation</Styles.Subtitle>
                    </Styles.Header>
                    <Styles.BannerContent>
                        <Styles.Value>
                            <Styles.Currency>
                                {toApproxLocaleString(totalPortfolioValue).slice(0, -3)}
                                <Styles.Decimals>{toApproxLocaleString(totalPortfolioValue).slice(-3)}</Styles.Decimals>
                            </Styles.Currency>
                        </Styles.Value>
                    </Styles.BannerContent>
                </Styles.Banner>

                {!account && handleConnect && <ConnectWalletBanner handleConnect={handleConnect} />}
            </Styles.Container>
        </>
    );
};

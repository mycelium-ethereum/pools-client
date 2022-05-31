import React from 'react';
import { NetworkHintContainer, NetworkHint } from '~/components/NetworkHint';
import { Heading } from '~/components/PageTable';
import { PortfolioOverview } from '~/types/portfolio';
import { toApproxCurrency, toApproxLocaleString } from '~/utils/converters';
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
    const { portfolioDelta, realisedProfit, totalPortfolioValue, unrealisedProfit } = portfolioOverview;

    const deltaClassName = portfolioDelta > 0 ? 'up' : portfolioDelta < 0 ? 'down' : undefined;

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
                        <Styles.Actions>
                            <Styles.Dropdown
                                value={DENOTATION_FILTER_OPTIONS[0].value}
                                options={DENOTATION_FILTER_OPTIONS}
                                onSelect={() => console.log('add logic')}
                            />
                            <Styles.Dropdown
                                value={TIME_FILTER_OPTIONS[0].value}
                                options={TIME_FILTER_OPTIONS}
                                onSelect={() => console.log('add logic')}
                            />
                        </Styles.Actions>
                    </Styles.Header>
                    <Styles.BannerContent>
                        <Styles.Value>
                            <Styles.Currency>{toApproxLocaleString(totalPortfolioValue)}</Styles.Currency>
                        </Styles.Value>
                        {account && portfolioDelta !== 0 && (
                            <Styles.Value className={deltaClassName}>
                                {portfolioDelta.toFixed(2)}%
                                <Styles.ArrowIcon large className={deltaClassName} />
                            </Styles.Value>
                        )}
                    </Styles.BannerContent>
                </Styles.Banner>

                <Styles.CardContainer>
                    <Styles.Card
                        className={`${unrealisedProfit.gt(0) ? 'up' : unrealisedProfit.lt(0) ? 'down' : ''} arrow`}
                    >
                        <div>
                            <Styles.CardTitle>Unrealised Profit and Loss</Styles.CardTitle>
                            <Styles.CardValue>{toApproxCurrency(unrealisedProfit)}</Styles.CardValue>
                        </div>
                        {!unrealisedProfit.eq(0) && (
                            <Styles.ArrowIcon className={unrealisedProfit.lt(0) ? 'down' : ''} />
                        )}
                    </Styles.Card>
                    <Styles.Card className={realisedProfit.gt(0) ? 'up' : ''}>
                        <Styles.CardTitle>Realised Profit and Loss</Styles.CardTitle>
                        <Styles.CardValue>{toApproxCurrency(realisedProfit)}</Styles.CardValue>
                    </Styles.Card>
                </Styles.CardContainer>
                {!account && handleConnect && <ConnectWalletBanner handleConnect={handleConnect} />}
            </Styles.Container>
        </>
    );
};

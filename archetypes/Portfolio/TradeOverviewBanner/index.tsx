import React from 'react';
import { toApproxCurrency } from '~/utils/converters';
import * as Styles from './styles';
import { PortfolioOverview } from '../state';

type BannerTypes = {
    title: string;
    account: boolean;
    portfolioOverview: PortfolioOverview;
};

export const LEVERAGE_FILTER_OPTIONS = [
    { key: 'USD', value: 'USD' },
    { key: 'All Time', value: 'All Time' },
];

export const TradeOverviewBanner: React.FC<BannerTypes> = ({ title, account, portfolioOverview }) => {
    const { portfolioDelta, realisedProfit, totalPortfolioValue, unrealisedProfit } = portfolioOverview;

    const deltaClassName = portfolioDelta > 0 ? 'up' : portfolioDelta < 0 ? 'down' : undefined;

    return (
        <>
            <Styles.Title>{title}</Styles.Title>
            <Styles.Container>
                <Styles.Banner>
                    <Styles.Header>
                        <Styles.Subtitle>Valuation</Styles.Subtitle>
                        <Styles.Actions>
                            <Styles.Dropdown
                                value={LEVERAGE_FILTER_OPTIONS[0].value}
                                options={LEVERAGE_FILTER_OPTIONS}
                                onSelect={() => console.log('add logic')}
                            />
                            <Styles.Dropdown
                                value={LEVERAGE_FILTER_OPTIONS[1].value}
                                options={LEVERAGE_FILTER_OPTIONS}
                                onSelect={() => console.log('add logic')}
                            />
                        </Styles.Actions>
                    </Styles.Header>
                    <Styles.BannerContent>
                        <Styles.Value>
                            <Styles.Currency>$</Styles.Currency>
                            {totalPortfolioValue.toFixed(2)}
                        </Styles.Value>
                        {account && (
                            <Styles.Value className={deltaClassName}>
                                {portfolioDelta.toFixed(2)}% <Styles.ArrowIcon className={deltaClassName} />
                            </Styles.Value>
                        )}
                    </Styles.BannerContent>
                </Styles.Banner>

                <Styles.CardContainer>
                    <Styles.Card className={unrealisedProfit.gt(0) ? 'up' : unrealisedProfit.lt(0) ? 'down' : ''}>
                        <Styles.CardTitle>Unrealised Profit and Loss</Styles.CardTitle>
                        <Styles.CardValue>{toApproxCurrency(unrealisedProfit)}</Styles.CardValue>
                    </Styles.Card>
                    <Styles.Card className={realisedProfit.gt(0) ? 'up' : realisedProfit.lt(0) ? 'down' : ''}>
                        <Styles.CardTitle>Realised Profit and Loss</Styles.CardTitle>
                        <Styles.CardValue>{toApproxCurrency(realisedProfit)}</Styles.CardValue>
                    </Styles.Card>
                </Styles.CardContainer>
            </Styles.Container>
        </>
    );
};

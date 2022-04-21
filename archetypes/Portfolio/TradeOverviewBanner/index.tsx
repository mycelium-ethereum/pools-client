import React from 'react';
import * as Styles from './styles';

type BannerTypes = {
    title: string;
    account: boolean;
    content: Card[];
};
type Card = {
    title: string;
    value: string;
};

export const LEVERAGE_FILTER_OPTIONS = [
    { key: 'USD', value: 'USD' },
    { key: 'All Time', value: 'All Time' },
];

export const TradeOverviewBanner: React.FC<BannerTypes> = ({ title, account, content }) => {
    const hasBalance = false;

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
                            {content[0].value}
                        </Styles.Value>
                        {account && (
                            <Styles.Value variant="down">
                                {hasBalance ? '1.78' : '0.00'}% <Styles.ArrowIcon variant="down" />
                            </Styles.Value>
                        )}
                    </Styles.BannerContent>
                </Styles.Banner>

                <Styles.CardContainer>
                    <Styles.Card variant="down">
                        <Styles.CardTitle variant="down">Unrealised Profit and Loss</Styles.CardTitle>
                        <Styles.CardValue variant="down">{hasBalance || account ? '1.78' : '0.00'}%</Styles.CardValue>
                    </Styles.Card>
                    <Styles.Card>
                        <Styles.CardTitle>Realised Profit and Loss</Styles.CardTitle>
                        <Styles.CardValue>${hasBalance || account ? '1,7822' : '0.00'}</Styles.CardValue>
                    </Styles.Card>
                </Styles.CardContainer>
            </Styles.Container>
        </>
    );
};

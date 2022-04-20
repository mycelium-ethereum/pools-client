import React from 'react';
import * as Styles from './styles';

type BannerTypes = {
    title: string;
    content: Card[];
};
type Card = {
    title: string;
    value: string;
};

export const TradeOverviewBanner: React.FC<BannerTypes> = ({ title, content }) => (
    <Styles.Banner>
        <Styles.Text>{title}</Styles.Text>
        <Styles.BannerContent>
            {content?.map((v, i) => (
                <Card title={v.title} value={v.value} key={`${v.title}-${i}`} />
            ))}
        </Styles.BannerContent>
    </Styles.Banner>
);

export const Card: React.FC<Card> = ({ title, value }) => (
    <Styles.Card>
        <Styles.Text isBold showOpacity={value === '$0.00'}>
            {value}
        </Styles.Text>
        <Styles.CardTitle>{title}</Styles.CardTitle>
    </Styles.Card>
);

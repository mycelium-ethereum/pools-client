export type PagePath = '/' | '/trade' | '/portfolio' | '/stake';

export const seoContent = {
    '/': {
        title: 'Buy Pool Tokens',
        description: 'Build and trade with Tracer Perpetuals and gain leveraged exposure to any market in the world.',
        image: '/img/opengraph/main.jpg',
    },
    '/trade': {
        title: 'Trade',
        description: 'Mint and Burn your Pool Tokens.',
        image: '/img/opengraph/main.jpg',
    },
    '/portfolio': {
        title: 'Portfolio',
        description: 'Track your portfolio performance.',
        image: '/img/opengraph/portfolio.jpg',
    },
    '/stake': {
        title: 'Stake',
        description: 'Stake your Pool Tokens to earn MYC rewards.',
        image: '/img/opengraph/stake.jpg',
    },
};

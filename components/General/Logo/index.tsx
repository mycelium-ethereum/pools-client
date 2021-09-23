import React from 'react';
import { ARBITRUM, ARBITRUM_RINKEBY, KOVAN } from '@libs/constants';
import styled from 'styled-components';

// this doesnt actually enforce anything but helpful to understand what it is expecting
// @requires tokenName in the format {leverage}(UP|DOWN)-${ASSET}/${COLLATERAL}
type ShortLongToken = 'ETH_L' | 'ETH_S' | 'BTC_L' | 'BTC_S' | 'DEFAULT';
export const tokenSymbolToLogoTicker: (tokenSymbol?: string) => ShortLongToken = (tokenSymbol) => {
    if (!tokenSymbol) {
        return 'DEFAULT';
    }
    try {
        const [leverageSide, name] = tokenSymbol.split('-');
        const side = leverageSide.slice(-1);
        const asset = name.split('/')[0];
        return `${asset}_${side}` as ShortLongToken;
    } catch (error) {
        return 'DEFAULT';
    }
};

const clearLogos: Record<string, string> = {
    ETH: '/img/logos/currencies/eth_clear.svg',
    TEST1: '/img/logos/currencies/eth_clear.svg',
};

const logos: Record<string, string> = {
    TSLA: '/img/logos/currencies/tesla.svg',
    TEST1: '/img/logos/currencies/eth.svg',
    LINK: '/img/logos/currencies/link.svg',
    [ARBITRUM]: '/img/logos/currencies/arbitrum.svg',
    [ARBITRUM_RINKEBY]: '/img/logos/currencies/arbitrum.svg',
    [KOVAN]: '/img/logos/currencies/arbitrum.svg',
    ETHERSCAN: '/img/logos/currencies/etherscan.svg',
    USDC: '/img/logos/currencies/usdc.png',
    DEFAULT: '/img/logos/currencies/tesla.svg',
    ETH_L: '/img/logos/currencies/eth_long.svg',
    BTC_L: '/img/logos/currencies/btc_long.svg',
    ETH_S: '/img/logos/currencies/eth_short.svg',
    BTC_S: '/img/logos/currencies/btc_short.svg',
    ETH: '/img/logos/currencies/eth.svg',
    WETH: '/img/logos/currencies/eth.svg',
    BTC: '/img/logos/currencies/btc.svg',
    WBTC: '/img/logos/currencies/btc.svg',
    SUSHI: '/img/logos/currencies/sushi.svg',
    BALANCER: '/img/logos/currencies/balancer.svg',
};

interface LProps {
    className?: string;
    ticker: string;
    clear?: boolean; // true then display outlined image
}

export const Logo = styled(({ className, ticker, clear }: LProps) => {
    return <img className={className} src={clear ? clearLogos[ticker] : logos[ticker] ?? logos['ETH']} alt="logo" />;
})<LProps>`
    width: 30px;
    margin: 5px 0;
`;

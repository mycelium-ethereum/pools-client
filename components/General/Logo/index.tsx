import React from 'react';
import { ARBITRUM, KOVAN } from '@libs/constants';
import styled from 'styled-components';

const clearLogos: Record<string, string> = {
    ETH: '/img/logos/currencies/eth_clear.svg',
    TEST1: '/img/logos/currencies/eth_clear.svg',
};

const logos: Record<string, string> = {
    TSLA: '/img/logos/currencies/tesla.svg',
    ETH: '/img/logos/currencies/eth.svg',
    TEST1: '/img/logos/currencies/eth.svg',
    LINK: '/img/logos/currencies/link.svg',
    [ARBITRUM]: '/img/logos/currencies/arbitrum.svg',
    [KOVAN]: '/img/logos/currencies/arbitrum.svg',
    ETHERSCAN: '/img/logos/currencies/etherscan.svg',
    USDC: '/img/logos/currencies/usdc.png',
    DEFAULT: '/img/logos/currencies/tesla.svg',
};

interface LProps {
    className?: string;
    ticker: string;
    clear?: boolean; // true then display outlined image
}

export const Logo = styled(({ className, ticker, clear }: LProps) => {
    return <img className={className} src={clear ? clearLogos[ticker] : logos[ticker] ?? logos['TSLA']} alt="logo" />;
})<LProps>`
    width: 30px;
    margin: 5px 0;
`;

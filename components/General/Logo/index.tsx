import React from 'react';
import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import { classNames } from '@libs/utils/functions';

import Arbitrum from '@public/img/logos/currencies/arbitrum.svg';
import Etherscan from '@public/img/logos/currencies/etherscan.svg';
import ETH_L from '@public/img/logos/currencies/eth_long.svg';
import ETH_S from '@public/img/logos/currencies/eth_short.svg';
import BTC_L from '@public/img/logos/currencies/btc_long.svg';
import BTC_S from '@public/img/logos/currencies/btc_short.svg';
import ETH from '@public/img/logos/currencies/eth.svg';
import BTC from '@public/img/logos/currencies/btc.svg';
import SUSHI from '@public/img/logos/currencies/sushi.svg';
import BALANCER from '@public/img/logos/currencies/balancer.svg';
import USDC from '@public/img/logos/currencies/usdc.svg';

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

export type LogoTicker =
    | 'ETHERSCAN'
    | 'USDC'
    | 'ETH_L'
    | 'BTC_L'
    | 'ETH_S'
    | 'BTC_S'
    | 'ETH'
    | 'WETH'
    | 'BTC'
    | 'WBTC'
    | 'SUSHI'
    | 'BALANCER'
    | typeof ARBITRUM
    | typeof ARBITRUM_RINKEBY
    | 'DEFAULT';

const logos: Record<LogoTicker, any> = {
    [ARBITRUM]: Arbitrum,
    [ARBITRUM_RINKEBY]: Arbitrum,
    ETHERSCAN: Etherscan,
    USDC: USDC,
    DEFAULT: ETH,
    ETH_L: ETH_L,
    BTC_L: BTC_L,
    ETH_S: ETH_S,
    BTC_S: BTC_S,
    ETH: ETH,
    WETH: ETH,
    BTC: BTC,
    WBTC: BTC,
    SUSHI: SUSHI,
    BALANCER: BALANCER,
};

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'full';
interface LProps {
    className?: string;
    ticker: LogoTicker;
    size?: Size;
}

const SIZES: Record<Size, string> = {
    xs: 'w-4 h-4',
    sm: 'w-[20px] h-[20px]',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    full: 'h-full',
};

export const Logo: React.FC<LProps> = ({ className, ticker, size = 'sm' }: LProps) => {
    const LogoImage = logos[ticker] ?? logos['ETH'];
    return <LogoImage className={classNames(SIZES[size], className ?? '')} />;
};

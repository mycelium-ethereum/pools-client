import React from 'react';
import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import { classNames } from '@libs/utils/functions';

import Arbitrum from '@public/img/logos/currencies/arbitrum.svg';
import Etherscan from '@public/img/logos/currencies/etherscan.svg';
import ETH_L from '@public/img/logos/currencies/eth_long.svg';
import ETH_S from '@public/img/logos/currencies/eth_short.svg';
import EUR_L from '@public/img/logos/currencies/eur_long.svg';
import EUR_S from '@public/img/logos/currencies/eur_short.svg';
import BTC_L from '@public/img/logos/currencies/btc_long.svg';
import BTC_S from '@public/img/logos/currencies/btc_short.svg';
import TOKE_L from '@public/img/logos/currencies/toke_long.svg';
import TOKE_S from '@public/img/logos/currencies/toke_short.svg';
import LINK_L from '@public/img/logos/currencies/link_long.svg';
import LINK_S from '@public/img/logos/currencies/link_short.svg';
import AAVE_L from '@public/img/logos/currencies/aave_long.svg';
import AAVE_S from '@public/img/logos/currencies/aave_short.svg';
import ETH from '@public/img/logos/currencies/eth.svg';
import EUR from '@public/img/logos/currencies/eur.svg';
import BTC from '@public/img/logos/currencies/btc.svg';
import TOKE from '@public/img/logos/currencies/toke.svg';
import FRAX from '@public/img/logos/currencies/frax.svg';
import AAVE from '@public/img/logos/currencies/aave.svg';
import LINK from '@public/img/logos/currencies/link.svg';
import SUSHI from '@public/img/logos/currencies/sushi.svg';
import BALANCER from '@public/img/logos/currencies/balancer.svg';
import USDC from '@public/img/logos/currencies/usdc.svg';
import USD from '@public/img/logos/currencies/usd.svg';
import BASE from '@public/img/logos/currencies/base.svg';

// this doesnt actually enforce anything but helpful to understand what it is expecting
// @requires tokenName in the format {leverage}(UP|DOWN)-${ASSET}/${COLLATERAL}
type ShortLongToken = 'ETH_L' | 'ETH_S' | 'BTC_L' | 'BTC_S' | 'EUR_L' | 'EUR_S' | 'DEFAULT';
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
    | 'FRAX'
    | 'AAVE'
    | 'USD'
    | 'ETH_L'
    | 'EUR_L'
    | 'BTC_L'
    | 'TOKE_L'
    | 'LINK_L'
    | 'AAVE_L'
    | 'ETH_S'
    | 'EUR_S'
    | 'BTC_S'
    | 'TOKE_S'
    | 'LINK_S'
    | 'AAVE_S'
    | 'ETH'
    | 'EUR'
    | 'WETH'
    | 'BTC'
    | 'TOKE'
    | 'LINK'
    | 'WBTC'
    | 'SUSHI'
    | 'BALANCER'
    | 'BASE'
    | typeof ARBITRUM
    | typeof ARBITRUM_RINKEBY
    | 'DEFAULT';

const logos: Record<LogoTicker, any> = {
    [ARBITRUM]: Arbitrum,
    [ARBITRUM_RINKEBY]: Arbitrum,
    ETHERSCAN: Etherscan,
    USDC: USDC,
    USD: USD,
    FRAX: FRAX,
    AAVE: AAVE,
    DEFAULT: ETH,
    AAVE_L: AAVE_L,
    AAVE_S: AAVE_S,
    ETH_L: ETH_L,
    EUR_L: EUR_L,
    BTC_L: BTC_L,
    TOKE_L: TOKE_L,
    LINK_L: LINK_L,
    ETH_S: ETH_S,
    EUR_S: EUR_S,
    BTC_S: BTC_S,
    TOKE_S: TOKE_S,
    LINK_S: LINK_S,
    EUR: EUR,
    ETH: ETH,
    WETH: ETH,
    BTC: BTC,
    TOKE: TOKE,
    LINK: LINK,
    WBTC: BTC,
    SUSHI: SUSHI,
    BALANCER: BALANCER,
    BASE: BASE,
};

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'full';
interface LProps {
    className?: string;
    ticker: LogoTicker;
    size?: LogoSize;
}

const SIZES: Record<LogoSize, string> = {
    xs: 'h-4',
    sm: 'w-[20px] h-[20px]',
    md: 'h-6',
    lg: 'h-[32px]',
    full: 'h-full',
};

export const Logo: React.FC<LProps> = ({ className, ticker, size = 'sm' }: LProps) => {
    const LogoImage = logos[ticker] ?? logos['ETH'];
    return <LogoImage className={classNames(SIZES[size], className ?? '')} />;
};

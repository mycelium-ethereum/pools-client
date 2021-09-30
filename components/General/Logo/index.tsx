import React from 'react';
import { ARBITRUM, ARBITRUM_RINKEBY } from '@libs/constants';
import { classNames } from '@libs/utils/functions';

import TSLA from '@public/img/logos/currencies/tesla.svg';
import Arbitrum from '@public/img/logos/currencies/arbitrum.svg';
import Etherscan from '@public/img/logos/currencies/etherscan.svg';
import ETH_L from '@public/img/logos/currencies/eth_long.svg';
import ETH_S from '@public/img/logos/currencies/eth_short.svg';
import BTC_L from '@public/img/logos/currencies/btc_long.svg';
import BTC_S from '@public/img/logos/currencies/btc_short.svg';
import ETH from '@public/img/logos/currencies/eth.svg';
import BTC from '@public/img/logos/currencies/btc.svg';
import SUSHI from '@public/img/logos/currencies/sushi.svg';
import BALANCER_DARK from '@public/img/logos/currencies/balancer-black.svg';
import BALANCER_LIGHT from '@public/img/logos/currencies/balancer-white.svg';
import ETH_CLEAR from '@public/img/logos/currencies/tesla.svg';

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

const clearLogos: Record<string, any> = {
    ETH: ETH_CLEAR,
};

const USDCLogo: React.FC<{
    className: string;
}> = ({ className }) => <img className={className} src="/img/logos/currencies/usdc.png" alt={'USDC'} />;

const logos: Record<string, any> = {
    TSLA: TSLA,
    [ARBITRUM]: Arbitrum,
    [ARBITRUM_RINKEBY]: Arbitrum,
    ETHERSCAN: Etherscan,
    USDC: USDCLogo,
    DEFAULT: TSLA,
    ETH_L: ETH_L,
    BTC_L: BTC_L,
    ETH_S: ETH_S,
    BTC_S: BTC_S,
    ETH: ETH,
    WETH: ETH,
    BTC: BTC,
    WBTC: BTC,
    SUSHI: SUSHI,
    BALANCER_DARK: BALANCER_DARK,
    BALANCER_LIGHT: BALANCER_LIGHT,
};

type Size = 'sm' | 'md' | 'full';
interface LProps {
    className?: string;
    ticker: string;
    size?: Size;
    clear?: boolean; // true then display outlined image
}

const SIZES: Record<Size, string> = {
    sm: 'w-[20px] h-[20px]',
    md: 'w-6 h-6',
    full: 'h-full',
};

export const Logo: React.FC<LProps> = ({ className, ticker, clear, size = 'sm' }: LProps) => {
    const LogoImage = clear ? clearLogos[ticker] : logos[ticker] ?? logos['ETH'];
    return <LogoImage className={classNames(SIZES[size], 'my-2 mx-0', className ?? '')} />;
};

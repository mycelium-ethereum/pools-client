import React from 'react';
import { Dropdown } from '@components/General/Dropdown';
import { useSwapContext, swapDefaults, noDispatch } from '@context/SwapContext';
import { usePool } from '@context/PoolContext';
import { SideEnum } from '@libs/constants';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { tokenSymbolToLogoTicker } from '@components/General';
import Button from '@components/General/Button';

export default (() => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
    const { tokens } = usePoolTokens();
    const { side, selectedPool } = swapState;
    const pool = usePool(selectedPool);

    const getBalancerLink = (name: string, side: number) => {
        if (name === '1-BTC/USDC') {
            if (side === 0) {
                return 'https://arbitrum.balancer.fi/#/trade/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/0x1616bF7bbd60E57f961E83A602B6b9Abb6E6CAFc';
            } else if (side === 1) {
                return 'https://arbitrum.balancer.fi/#/trade/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/0x052814194f459aF30EdB6a506eABFc85a4D99501';
            }
        } else if (name === '1-ETH/USDC') {
            if (side === 0) {
                return 'https://arbitrum.balancer.fi/#/trade/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/0x38c0a5443c7427e65A9Bf15AE746a28BB9a052cc';
            } else if (side === 1) {
                return 'https://arbitrum.balancer.fi/#/trade/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/0xf581571DBcCeD3A59AaaCbf90448E7B3E1704dcD';
            }
        } else if (name === '3-BTC/USDC') {
            if (side === 0) {
                return 'https://arbitrum.balancer.fi/#/trade/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/0x05A131B3Cd23Be0b4F7B274B3d237E73650e543d';
            } else if (side === 1) {
                return 'https://arbitrum.balancer.fi/#/trade/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/0x85700dC0bfD128DD0e7B9eD38496A60baC698fc8';
            }
        } else if (name === '3-ETH/USDC') {
            if (side === 0) {
                return 'https://arbitrum.balancer.fi/#/trade/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/0xaA846004Dc01b532B63FEaa0b7A0cB0990f19ED9';
            } else if (side === 1) {
                return 'https://arbitrum.balancer.fi/#/trade/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8/0x7d7E4f49a29dDA8b1eCDcf8a8bc85EdcB234E997';
            }
        }
    };

    console.log(getBalancerLink(pool.name, side));

    return (
        <div className="w-full justify-center mt-14">
            <div className="bg-theme-background w-full md:w-[611px] md:shadow-xl rounded-3xl py-8 px-4 md:py-8 md:px-12 md:my-8 md:mx-auto">
                <div className="text-2xl text-center">Instantly buy and sell tokens on Balancer</div>
                <div className="text-sm text-cool-gray-400">
                    There is no need to mint and burn. There are already pool tokens on Balancer.
                </div>
                <Dropdown
                    className="w-full my-10"
                    placeHolder="Select Token"
                    placeHolderIcon={tokenSymbolToLogoTicker(
                        side === SideEnum.long ? pool.longToken.symbol : pool.shortToken.symbol,
                    )}
                    size="lg"
                    options={tokens.map((token) => ({
                        key: `${token.pool}-${token.side}`,
                        text: token.symbol,
                        ticker: tokenSymbolToLogoTicker(token.symbol),
                    }))}
                    value={side === SideEnum.long ? pool.longToken.symbol : pool.shortToken.symbol}
                    onSelect={(option) => {
                        const [pool, side] = option.split('-');
                        swapDispatch({ type: 'setSelectedPool', value: pool as string });
                        swapDispatch({ type: 'setSide', value: parseInt(side) as SideEnum });
                    }}
                />
                <a href={getBalancerLink(pool.name, side)} target="_blank" rel="noreferrer">
                    <Button size="lg" variant="primary">
                        Take me to Balancer
                    </Button>
                </a>
            </div>
        </div>
    );
}) as React.FC;

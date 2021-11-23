import React from 'react';
import { Dropdown } from '@components/General/Dropdown';
import { noDispatch, swapDefaults, useSwapContext } from '@context/SwapContext';
import { usePool } from '@context/PoolContext';
import { ARBITRUM, SideEnum } from '@libs/constants';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { tokenSymbolToLogoTicker } from '@components/General';
import Button from '@components/General/Button';
import { constructBalancerLink } from '@archetypes/Exchange/Summary';

export default (() => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
    const { tokens } = usePoolTokens();
    const { side, selectedPool } = swapState;
    const pool = usePool(selectedPool);

    return (
        <div className="w-full justify-center sm:mt-14">
            <div className="bg-theme-background w-full md:w-[611px] md:shadow-xl sm:rounded-3xl py-8 px-4 md:py-16 md:px-20 md:my-8 md:mx-auto">
                <div className="text-2xl text-center">Instantly buy and sell tokens on Balancer</div>
                <div className="text-sm text-center text-cool-gray-400 mt-2">
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
                <a
                    href={constructBalancerLink(
                        side === SideEnum.long ? pool.longToken.address : pool.shortToken.address,
                        ARBITRUM,
                        true,
                    )}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Button size="lg" variant="primary">
                        Take me to Balancer
                    </Button>
                </a>
            </div>
        </div>
    );
}) as React.FC;

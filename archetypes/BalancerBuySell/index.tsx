import React from 'react';
import { Dropdown, HiddenExpand } from '@components/General/Dropdown';
import { LEVERAGE_OPTIONS, SIDE_OPTIONS, noDispatch, swapDefaults, useSwapContext } from '@context/SwapContext';
import { ARBITRUM, SideEnum } from '@libs/constants';
import { Logo, LogoTicker, tokenSymbolToLogoTicker } from '@components/General';
import Button from '@components/General/Button';
import { constructBalancerLink } from '@archetypes/Exchange/Summary';
import TWButtonGroup from '@components/General/TWButtonGroup';
import TooltipSelector, { TooltipKeys } from '@components/Tooltips/TooltipSelector';
import Divider from '@components/General/Divider';
import { poolMap } from '@libs/constants/poolLists';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { StaticPoolInfo } from '@libs/types/General';
import { classNames } from '@libs/utils/functions';
import { StyledTooltip } from '@components/Tooltips';

export default (() => {
    const { network = ARBITRUM } = useWeb3();
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
    const { leverage, selectedPool, side, market, markets } = swapState;
    const pool: StaticPoolInfo | undefined = poolMap[network][selectedPool ?? ''];

    const valid = !Number.isNaN(leverage) && !!market && !Number.isNaN(side);

    const token = side === SideEnum.long ? pool?.longToken : pool?.shortToken;

    return (
        <div className="w-full justify-center sm:mt-14">
            <div className="bg-theme-background w-full max-w-screen-sm md:shadow-xl md:rounded-3xl py-12 px-4 md:py-16 md:px-20 md:my-8 md:mx-auto">
                <div className="text-xl font-bold mb-6">Trade Pool Tokens on Balancer</div>
                <div className="text-base text-cool-gray-400 mt-2">
                    Looking for leveraged exposure? There is no need to mint and burn. There are already pool tokens on
                    Balancer.
                </div>
                <Divider className="my-8" />
                <div className={`relative flex justify-between my-4 md:my-8`}>
                    <span className="w-full mr-8">
                        <p className="mb-2 text-base font-bold">Market</p>
                        <Dropdown
                            className="w-full "
                            placeHolder="Select Market"
                            placeHolderIcon={pool?.name?.split('-')[1]?.split('/')[0] as LogoTicker}
                            size="lg"
                            options={Object.keys(markets).map((market) => ({
                                key: market,
                                ticker: market.split('/')[0] as LogoTicker,
                                text: market,
                            }))}
                            value={market}
                            onSelect={(selectedMarket) => {
                                swapDispatch({ type: 'setPoolFromMarket', market: selectedMarket as string });
                            }}
                        />
                    </span>
                    <span>
                        <p className="mb-2 text-base font-bold">Side</p>
                        <TWButtonGroup
                            value={side}
                            onClick={(option) => swapDispatch({ type: 'setSide', value: option as SideEnum })}
                            size={'lg'}
                            borderColor={'tracer'}
                            options={SIDE_OPTIONS}
                        />
                    </span>
                </div>
                <div className={`relative my-4 md:my-8`}>
                    <TooltipSelector tooltip={{ key: TooltipKeys.PowerLeverage }}>
                        <div className="mb-2 text-base font-bold w-min whitespace-nowrap">Power Leverage</div>
                    </TooltipSelector>
                    <TWButtonGroup
                        value={leverage}
                        borderColor={'tracer'}
                        options={LEVERAGE_OPTIONS.map((option) => ({
                            key: option.leverage,
                            text: `${option.leverage}`,
                            disabled: option.disabled
                                ? {
                                      optionKey: TooltipKeys.ComingSoon,
                                  }
                                : undefined,
                        }))}
                        onClick={(index) => {
                            swapDispatch({ type: 'setLeverage', value: index });
                        }}
                    />
                </div>
                <HiddenExpand
                    defaultHeight={0}
                    open={!!pool?.name}
                    className={classNames(
                        'border-2xl border text-base bg-theme-background',
                        !!pool?.name ? 'border-theme-border' : 'border-transparent',
                    )}
                >
                    <div className="relative border-box px-4 pt-4 pb-2">
                        <h2 className="text-theme-text">
                            <Logo className="inline mr-2" size="md" ticker={tokenSymbolToLogoTicker(token?.symbol)} />
                            {token?.name}
                        </h2>
                        <div className={'absolute left-6 -top-4 text-sm z-[2] p-1.5 rounded bg-theme-background'}>
                            {'I want to trade'}
                        </div>
                    </div>
                </HiddenExpand>
                <div className="mt-8">
                    {!valid ? (
                        <StyledTooltip title="Select the market, side, and power leverage you're after.">
                            <div>
                                <Button
                                    size="lg"
                                    variant="primary"
                                    onClick={() =>
                                        open(constructBalancerLink(token?.address, ARBITRUM, true), '_blank')
                                    }
                                    disabled={!valid}
                                >
                                    Take me to Balancer
                                </Button>
                            </div>
                        </StyledTooltip>
                    ) : (
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() => open(constructBalancerLink(token?.address, ARBITRUM, true), '_blank')}
                            disabled={!valid}
                        >
                            Take me to Balancer
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}) as React.FC;

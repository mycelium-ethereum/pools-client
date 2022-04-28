import React from 'react';
import Link from 'next/link';
import shallow from 'zustand/shallow';
import { poolMap, StaticPoolInfo, KnownNetwork, SideEnum, NETWORKS } from '@tracer-protocol/pools-js';
import { Logo, LogoTicker, tokenSymbolToLogoTicker } from '~/components/General';
import Button from '~/components/General/Button';
import Divider from '~/components/General/Divider';
import { Dropdown, HiddenExpand } from '~/components/General/Dropdown';
import TWButtonGroup from '~/components/General/TWButtonGroup';
import { StyledTooltip } from '~/components/Tooltips';
import TooltipSelector, { TooltipKeys } from '~/components/Tooltips/TooltipSelector';

import { balancerConfig } from '~/constants/balancer';
import { networkConfig } from '~/constants/networks';
import { LEVERAGE_OPTIONS, SIDE_OPTIONS, noDispatch, swapDefaults, useSwapContext } from '~/context/SwapContext';
import { useStore } from '~/store/main';
import { selectHandleConnect, selectWeb3Info } from '~/store/Web3Slice';
import { classNames } from '~/utils/helpers';
import { getBaseAsset, getBaseAssetFromMarket } from '~/utils/poolNames';

export default (() => {
    const { network = NETWORKS.ARBITRUM, account } = useStore(selectWeb3Info, shallow);
    const handleConnect = useStore(selectHandleConnect);
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
    const { leverage, selectedPool, side, market, markets } = swapState;
    const pool: StaticPoolInfo | undefined = poolMap[network]?.[selectedPool ?? ''];

    const valid = !Number.isNaN(leverage) && !!market && !Number.isNaN(side);

    const hasBalancerPool = market && (market === 'ETH/USD' || market === 'BTC/USD');

    const token = side === SideEnum.long ? pool?.longToken : pool?.shortToken;

    const button = () => {
        if (!account) {
            return (
                <Button size="lg" variant="primary" onClick={handleConnect}>
                    Connect Wallet
                </Button>
            );
        } else if (!valid) {
            return (
                <StyledTooltip title="Select the market, side, and power leverage you're after.">
                    <div>
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() =>
                                open(constructBalancerLink(token?.address, NETWORKS.ARBITRUM, true), '_blank')
                            }
                            disabled={true}
                        >
                            Take me to Balancer
                        </Button>
                    </div>
                </StyledTooltip>
            );
        } else if (!hasBalancerPool) {
            return (
                <StyledTooltip
                    title={
                        <>
                            {`There are no Balancer pools for pool tokens tracking the ${market} market yet. `}
                            <Link href="/pools">Mint/burn here.</Link>
                        </>
                    }
                >
                    <div>
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() =>
                                open(constructBalancerLink(token?.address, NETWORKS.ARBITRUM, true), '_blank')
                            }
                            disabled={true}
                        >
                            Take me to Balancer
                        </Button>
                    </div>
                </StyledTooltip>
            );
        } else {
            return (
                <Button
                    size="lg"
                    variant="primary"
                    onClick={() => open(constructBalancerLink(token?.address, NETWORKS.ARBITRUM, true), '_blank')}
                    disabled={!valid}
                >
                    Take me to Balancer
                </Button>
            );
        }
    };

    return (
        <div className="w-full justify-center sm:mt-20">
            <div className="mx-auto w-full max-w-screen-sm bg-theme-background py-12 px-4 sm:rounded-3xl md:py-16 md:px-20 md:shadow-xl">
                <div className="mb-6 text-xl font-bold">Trade Pool Tokens on Balancer</div>
                <div className="mt-2 text-base text-cool-gray-400">
                    Looking for leveraged exposure? There is no need to mint and burn. There are already pool tokens on
                    Balancer.
                </div>
                <Divider className="my-8" />
                <div className={`relative my-4 flex justify-between md:my-8`}>
                    <span className="mr-8 w-full">
                        <p className="mb-2 text-base font-bold">Market</p>
                        <Dropdown
                            className="w-full "
                            placeHolder="Select Market"
                            placeHolderIcon={getBaseAsset(pool?.name) as LogoTicker}
                            size="lg"
                            options={Object.keys(markets).map((market) => ({
                                key: market,
                                ticker: getBaseAssetFromMarket(market) as LogoTicker,
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
                        <div className="mb-2 w-min whitespace-nowrap text-base font-bold">Power Leverage</div>
                    </TooltipSelector>
                    <TWButtonGroup
                        value={leverage}
                        borderColor={'tracer'}
                        options={LEVERAGE_OPTIONS(market).map((option) => ({
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
                            swapDispatch({ type: 'setPoolFromLeverage', value: index });
                        }}
                    />
                </div>
                <HiddenExpand
                    defaultHeight={0}
                    open={!!pool?.name}
                    className={classNames(
                        'border-2xl border bg-theme-background text-base',
                        !!pool?.name ? 'border-theme-border' : 'border-transparent',
                    )}
                >
                    <div className="border-box relative px-4 pt-4 pb-2">
                        <h2 className="text-theme-text">
                            <Logo className="mr-2 inline" size="md" ticker={tokenSymbolToLogoTicker(token?.symbol)} />
                            {token?.name}
                        </h2>
                        <div className={'absolute left-6 -top-4 z-[2] rounded bg-theme-background p-1.5 text-sm'}>
                            {'I want to trade'}
                        </div>
                    </div>
                </HiddenExpand>
                <div className="mt-8">{button()}</div>
            </div>
        </div>
    );
}) as React.FC;

export const constructBalancerLink: (token: string | undefined, network: KnownNetwork, isBuy: boolean) => string = (
    token,
    network,
    isBuy,
) => {
    const { usdcAddress } = networkConfig[network];
    const balancerInfo = balancerConfig[network];

    // balancerInfo will not be undefined due to the network === ARBITRUM in BalancerLink
    return isBuy
        ? `${balancerInfo?.baseUri}/${usdcAddress}/${token}`
        : `${balancerInfo?.baseUri}/${token}/${usdcAddress}`;
};

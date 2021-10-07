import React, { useContext, useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { SwapContext } from '@context/SwapContext';
import { CommitActionEnum } from '@libs/constants';
import Gas from './Gas';
import Buy from './Buy';
import Sell from './Sell';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';
import { TWModal } from '@components/General/TWModal';

import Close from '/public/img/general/close.svg';
import Button from '@components/General/Button';

const TRADE_OPTIONS = [
    {
        key: CommitActionEnum.mint,
        text: 'Mint',
    },
    {
        key: CommitActionEnum.burn,
        text: 'Burn',
    },
];

export default (() => {
    const { swapState, swapDispatch } = useContext(SwapContext);
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [onboardStep, setOnboardStep] = useState(1);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowOnboardModal(true);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    const OnboardContent = () => {
        switch (onboardStep) {
            case 1:
                return (
                    <>
                        <div className="text-2xl text-center my-5">{`Welcome to Tracer's Perpetual Pools`}</div>
                        <Divider className="mb-8" />
                        <div className="text-sm text-center">
                            Fully fungible leveraged tokens. No margin, No liquidations. Up to 3p{' '}
                            <span className="green">long</span> or <span className="red">short</span> exposure to ETH or
                            BTC in your wallet.
                        </div>
                        <div className="my-8 text-sm text-center font-bold">Want to learn more?</div>
                        <div className="flex">
                            <Button variant="primary" className="mr-5" onClick={() => setOnboardStep(onboardStep + 1)}>
                                Show me around
                            </Button>
                            <Button variant="primary-light" onClick={() => setShowOnboardModal(false)}>
                                Get started
                            </Button>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="text-2xl text-center my-5">How it works</div>
                        <Divider className="mb-8" />
                        <div className="text-sm mb-8">
                            1. Deposit collateral into a pool. <br />
                            2. Mint tokens that represent your ownership and entitle you to a fraction of the pools
                            funds. <br />
                            3. Funds move between long and short sides of the pool based on underlying asset movement,
                            which is reflected in your pool token price. <br />
                            4. Burn your tokens and claim your collateral/realise your PnL.
                        </div>
                        <div className="flex">
                            <Button
                                variant="primary-light"
                                className="mr-5"
                                onClick={() => setOnboardStep(onboardStep - 1)}
                            >
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setOnboardStep(onboardStep + 1)}>
                                Next
                            </Button>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="text-2xl text-center my-5">Crossing the bridge from L1 to Arbitrum</div>
                        <Divider className="mb-8" />
                        <div className="text-sm mb-8">
                            Perpetual Pools are native to Arbitrum. Move your funds from L1 to L2 with the{' '}
                            <a href="https://bridge.arbitrum.io" target="_blank" rel="noreferrer">
                                Arbitrum bridge
                            </a>{' '}
                            to get started. Please note the 7 day withdrawal timeframe from Arbitrum back to the
                            main-chain. <br />
                            <br />
                            Read our{' '}
                            <a
                                href="https://tracer.finance/radar/bridging-to-arbitrum"
                                target="_blank"
                                rel="noreferrer"
                            >
                                guide on bridging to Arbitrum.
                            </a>
                        </div>
                        <div className="flex">
                            <Button
                                variant="primary-light"
                                className="mr-5"
                                onClick={() => setOnboardStep(onboardStep - 1)}
                            >
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setOnboardStep(onboardStep + 1)}>
                                Next
                            </Button>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <div className="text-2xl text-center my-5">Mint and burn Pool tokens</div>
                        <Divider className="mb-8" />
                        <div className="text-sm mb-8">
                            {`Once you've browsed the available markets, head to the exchange to mint tokens.`} <br />
                            <br />
                            Guide:{' '}
                            <a href="https://tracer.finance/radar/minting-burning" target="_blank" rel="noreferrer">
                                Minting and Burning
                            </a>
                        </div>
                        <div className="flex">
                            <Button
                                variant="primary-light"
                                className="mr-5"
                                onClick={() => setOnboardStep(onboardStep - 1)}
                            >
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setOnboardStep(onboardStep + 1)}>
                                Next
                            </Button>
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <div className="text-2xl text-center my-5">Want to learn more?</div>
                        <Divider className="mb-8" />
                        <div className="text-sm mb-8">
                            Read the{' '}
                            <a
                                href="https://tracer.finance/static/Tracer Perpetual Pools-efc7c29f638cb788832aafe0f41c07bd.pdf"
                                target="_blank"
                                rel="noreferrer"
                            >
                                litepaper
                            </a>
                            <br />
                            <br />
                            Browse the{' '}
                            <a href="https://docs.tracer.finance" target="_blank" rel="noreferrer">
                                documentation
                            </a>
                            <br />
                            <br />
                            Check out{' '}
                            <a
                                href="https://tracer.finance/radar"
                                target="_blank"
                                rel="noreferrer"
                            >{`Radar, Tracer's blog`}</a>
                            <br />
                            <br />
                            Catch up on{' '}
                            <a
                                href="https://www.youtube.com/channel/UChQFEjLu4vaaS96iCRbasFg"
                                target="_blank"
                                rel="noreferrer"
                            >
                                episodes of the Tracer Drop
                            </a>{' '}
                            with RMIT Blockchain Innovation hub
                        </div>
                        <div className="flex">
                            <Button
                                variant="primary-light"
                                className="mr-5"
                                onClick={() => setOnboardStep(onboardStep - 1)}
                            >
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setShowOnboardModal(false)}>
                                Done
                            </Button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full justify-center">
            <div className="bg-theme-background w-full md:w-[611px] md:shadow-xl rounded-3xl py-8 px-4 md:py-8 md:px-12 md:my-8 md:mx-auto ">
                <div className="flex">
                    <TWButtonGroup
                        value={swapState?.commitAction ?? CommitActionEnum.mint}
                        size={'xl'}
                        color={'tracer'}
                        onClick={(val) => {
                            if (swapDispatch) {
                                swapDispatch({ type: 'setAmount', value: new BigNumber(0) });
                                swapDispatch({ type: 'setLeverage', value: 1 });
                                swapDispatch({ type: 'setCommitAction', value: val as CommitActionEnum });
                            }
                        }}
                        options={TRADE_OPTIONS}
                    />
                    <Gas />
                </div>

                <Divider className="my-8" />

                {/** Inputs */}
                {swapState?.commitAction === CommitActionEnum.burn ? <Sell /> : <Buy />}
            </div>

            <TWModal open={showOnboardModal} onClose={() => setShowOnboardModal(false)}>
                <div className="w-3 h-3 ml-auto cursor-pointer" onClick={() => setShowOnboardModal(false)}>
                    <Close />
                </div>
                <div className="onboard">{OnboardContent()}</div>
                <style>{`
                     .onboard a {
                        text-decoration: underline;
                        cursor: pointer;
                    }
                `}</style>
            </TWModal>
        </div>
    );
}) as React.FC;

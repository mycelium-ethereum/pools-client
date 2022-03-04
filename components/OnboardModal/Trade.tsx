import React from 'react';
import { useTheme } from '@context/ThemeContext';
import { TWModal } from '@components/General/TWModal';
import Divider from '@components/General/Divider';
import Button from '@components/General/Button';
import ProgressIndicator from '@components/OnboardModal/ProgressIndicator';
import * as Styled from './styles';
import { OnboardModalProps } from './types';

import Wave from '/public/img/onboard/wave.svg';
import Question from '/public/img/onboard/question.svg';

const OnboardTradeModal: React.FC<OnboardModalProps> = ({
    onboardStep,
    setOnboardStep,
    showOnboardModal,
    setShowOnboardModal,
}) => {
    const { isDark } = useTheme();
    const OnboardContent = () => {
        switch (onboardStep) {
            case 1:
                return (
                    <>
                        <div className="flex justify-center">
                            <Wave fill={`${isDark ? '#374151' : '#F3F4F6'}`} />
                        </div>
                        <div className="text-2xl text-center my-5">{`Welcome to Tracer's Perpetual Pools`}</div>
                        <Divider className="mb-8" />
                        <div className="text-sm text-center">
                            Fully fungible leveraged tokens. No margin, No liquidations. Up to 3p{' '}
                            <span className="green">long</span> or <span className="red">short</span> exposure to ETH or
                            BTC in your wallet.
                        </div>
                        <div className="my-8 text-sm text-center font-bold">Want to learn more?</div>
                        <ProgressIndicator totalSteps={5} currentStep={1} />
                        <div className="flex flex-col-reverse sm:flex-row">
                            <Button
                                variant="primary-light"
                                className="mr-5 mt-3 sm:mt-0"
                                onClick={() => setShowOnboardModal()}
                            >
                                {`No thanks, I'd like to get started`}
                            </Button>
                            <Button variant="primary" onClick={() => setOnboardStep(onboardStep + 1)}>
                                Sure, show me around!
                            </Button>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="flex justify-center">
                            <Question fill={`${isDark ? '#374151' : '#E5E7EB'}`} />
                        </div>
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
                        <ProgressIndicator totalSteps={5} currentStep={2} />
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
                        <div className="flex justify-center">
                            <Question fill={`${isDark ? '#374151' : '#E5E7EB'}`} />
                        </div>
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
                        <ProgressIndicator totalSteps={5} currentStep={3} />
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
                        <div className="flex justify-center">
                            <Question fill={`${isDark ? '#374151' : '#E5E7EB'}`} />
                        </div>
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
                        <ProgressIndicator totalSteps={5} currentStep={4} />
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
                        <div className="flex justify-center">
                            <Question fill={`${isDark ? '#374151' : '#E5E7EB'}`} />
                        </div>
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
                            <a href="https://tracer.finance/radar" target="_blank" rel="noreferrer">
                                {`Radar, Tracer's blog`}
                            </a>
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
                        <ProgressIndicator totalSteps={5} currentStep={5} />
                        <div className="flex">
                            <Button
                                variant="primary-light"
                                className="mr-5"
                                onClick={() => setOnboardStep(onboardStep - 1)}
                            >
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setShowOnboardModal()}>
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
        <TWModal open={showOnboardModal} onClose={() => setShowOnboardModal()}>
            <Styled.Close onClick={() => setShowOnboardModal()} />
            <Styled.OnboardContent className="onboard">{OnboardContent()}</Styled.OnboardContent>
        </TWModal>
    );
};

export default OnboardTradeModal;

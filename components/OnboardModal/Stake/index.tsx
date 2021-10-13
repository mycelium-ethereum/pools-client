import React from 'react';
import { useTheme } from '@context/ThemeContext';

import { TWModal } from '@components/General/TWModal';
import Divider from '@components/General/Divider';
import Button from '@components/General/Button';

import Close from '/public/img/general/close.svg';
import WaveLight from '/public/img/onboard/wave-light.svg';
import WaveDark from '/public/img/onboard/wave-dark.svg';
import QuestionLight from '/public/img/onboard/question-light.svg';
import QuestionDark from '/public/img/onboard/question-dark.svg';

interface OnboardModalProps {
    onboardStep: number;
    setOnboardStep: React.Dispatch<React.SetStateAction<number>>;
    showOnboardModal: boolean;
    setShowOnboardModal: () => any;
}
const OnboardStakeModal: React.FC<OnboardModalProps> = ({
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
                        <div className="flex justify-center">{isDark ? <WaveDark /> : <WaveLight />}</div>
                        <div className="text-2xl text-center my-5">Stake Pool tokens</div>
                        <Divider className="mb-8" />
                        <div className="text-sm mb-8">
                            When you receive pool tokens, stake them to earn TCR. <br />
                            <br />
                            Guide:{' '}
                            <a href="https://tracer.finance/radar/staking" target="_blank" rel="noreferrer">
                                Staking
                            </a>
                        </div>
                        <div className="my-8 text-sm text-center font-bold">Want to learn more?</div>
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
                        <div className="flex justify-center">{isDark ? <QuestionDark /> : <QuestionLight />}</div>
                        <div className="text-2xl text-center my-5">Explore the wider landscape</div>
                        <Divider className="mb-8" />
                        <div className="text-sm mb-8">
                            Staking for Balancer Pool Tokens (BPT) is now available. Provide token liquidity on Balancer
                            to earn more TCR.
                            {` We're excited by what's possible with Perpetual Pool tokens. If you are too, join the `}
                            <a href="https://discord.com/invite/kddBUqDVVb" target="_blank" rel="noreferrer">
                                discord
                            </a>
                            .
                        </div>
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
            <div className="w-3 h-3 ml-auto cursor-pointer" onClick={() => setShowOnboardModal()}>
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
    );
};

export default OnboardStakeModal;

import React from 'react';
import Button from '~/components/General/Button';
import { TWModal } from '~/components/General/TWModal';
import ProgressIndicator from '~/components/OnboardModal/ProgressIndicator';
import * as Styles from './styles';
import { OnboardModalProps } from './types';

const OnboardTradeModal: React.FC<OnboardModalProps> = ({
    onboardStep,
    setOnboardStep,
    showOnboardModal,
    setShowOnboardModal,
}) => {
    const OnboardContent = () => {
        switch (onboardStep) {
            case 1:
                return (
                    <>
                        <Styles.Heading>Welcome to Tracer&#39;s Perpetual Pools</Styles.Heading>

                        <Styles.Content>
                            <Styles.Text>
                                Your favourite assets, leveraged.
                                <br />
                                Now, mint tokens and hold them long-term.
                            </Styles.Text>
                            <Styles.Text>
                                Go <Styles.Color variant="green">long</Styles.Color>, go{' '}
                                <Styles.Color variant="red">short</Styles.Color>, and <Styles.Color>stake</Styles.Color>{' '}
                                to earn.
                            </Styles.Text>
                        </Styles.Content>

                        <ProgressIndicator totalSteps={5} currentStep={1} />

                        <Button variant="primary" onClick={() => setOnboardStep(onboardStep + 1)}>
                            Show me around!
                        </Button>
                    </>
                );
            case 2:
                return (
                    <>
                        <Styles.Heading>Move Funds to Arbitrum</Styles.Heading>

                        <Styles.Content>
                            <Styles.Text>
                                You need assets on Arbitrum to buy and mint tokens. Use the bridge to easily move funds
                                between networks, without leaving the app.
                            </Styles.Text>
                            <Styles.Text>Reminder: It takes 7 days to withdraw to Ethereum.</Styles.Text>
                        </Styles.Content>
                        <ProgressIndicator totalSteps={5} currentStep={2} />
                        <Styles.ButtonContainer>
                            <Button variant="primary-light" onClick={() => setOnboardStep(onboardStep - 1)}>
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setOnboardStep(onboardStep + 1)}>
                                Next
                            </Button>
                        </Styles.ButtonContainer>
                    </>
                );
            case 3:
                return (
                    <>
                        <Styles.Heading>Join a Pool</Styles.Heading>

                        <Styles.Content>
                            <Styles.Text>
                                Go long or short in a Pool to mint leveraged tokens. Just add funds and get new tokens
                                in 8 hours.
                            </Styles.Text>
                            <Styles.Text>
                                What&#39;s the wait for? See the docs:{' '}
                                <Styles.Link href="https://tracer.finance/radar/minting-burning/">
                                    Minting and Burning.
                                </Styles.Link>
                            </Styles.Text>
                        </Styles.Content>

                        <ProgressIndicator totalSteps={5} currentStep={3} />
                        <Styles.ButtonContainer>
                            <Button variant="primary-light" onClick={() => setOnboardStep(onboardStep - 1)}>
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setOnboardStep(onboardStep + 1)}>
                                Next
                            </Button>
                        </Styles.ButtonContainer>
                    </>
                );
            case 4:
                return (
                    <>
                        <Styles.Heading>Track Tokens and Performance</Styles.Heading>

                        <Styles.Content>
                            <Styles.Text>
                                All of your tokens in the one place. See holdings and order history in the Portfolio,
                                and check PnL.
                            </Styles.Text>
                            <Styles.Text>Remember to claim if you want to move assets to a wallet.</Styles.Text>
                        </Styles.Content>

                        <ProgressIndicator totalSteps={5} currentStep={4} />
                        <Styles.ButtonContainer>
                            <Button variant="primary-light" onClick={() => setOnboardStep(onboardStep - 1)}>
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setOnboardStep(onboardStep + 1)}>
                                Next
                            </Button>
                        </Styles.ButtonContainer>
                    </>
                );
            case 5:
                return (
                    <>
                        <Styles.Heading>Want to Learn More?</Styles.Heading>

                        <Styles.Content>
                            <Styles.Text>
                                Browse the user documentation.
                                <br />
                                Check out Radar, Tracer&#39;s Blog.
                                <br />
                                Join the community on Discord.
                            </Styles.Text>
                        </Styles.Content>

                        <ProgressIndicator totalSteps={5} currentStep={5} />
                        <Styles.ButtonContainer>
                            <Button variant="primary-light" onClick={() => setOnboardStep(onboardStep - 1)}>
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setShowOnboardModal()}>
                                Done
                            </Button>
                        </Styles.ButtonContainer>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <TWModal open={showOnboardModal} onClose={() => setShowOnboardModal()}>
            <Styles.Close onClick={() => setShowOnboardModal()} />
            <Styles.OnboardContent className="onboard">{OnboardContent()}</Styles.OnboardContent>
        </TWModal>
    );
};

export default OnboardTradeModal;

import React from 'react';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import { swapDefaults, useBigNumber, useSwapContext } from '@context/SwapContext';
import { CommitActionEnum } from '@libs/constants';
import Button from '@components/General/Button';
import { useDex, useDexActions } from '@context/BalancerContext';

const ExchangeButton: React.FC<{ actionType: CommitActionEnum }> = ({ actionType }) => {
    const { account } = useWeb3();
    const { handleConnect } = useWeb3Actions();
    const { swapState = swapDefaults } = useSwapContext();
    const { selectedPool, amount, invalidAmount } = swapState;

    const amountBN = useBigNumber(amount);

    const { usdcApproved } = useDex();
    console.log(usdcApproved)
    const { approve, makeTrade } = useDexActions();

    const ButtonContent = () => {
        if (!account) {
            return (
                <Button
                    size="lg"
                    variant="primary"
                    onClick={(_e) => {
                        handleConnect();
                    }}
                >
                    Connect Wallet
                </Button>
            );
        }
        if (
            !usdcApproved
        ) {
            return (
                <>
                    <Button
                        size="lg"
                        variant="primary"
                        disabled={!selectedPool}
                        onClick={(_e) => {
                            if (!approve) {
                                return;
                            }
                            approve()
                        }}
                    >
                        Unlock USDC
                    </Button>
                    <p className="mt-2 text-theme-text text-sm text-center opacity-70">
                        Unlock USDC to start investing with Tracer. This is a one-time transaction for each pool.
                    </p>
                </>
            );
        } else {
            return (
                <Button
                    size="lg"
                    variant="primary"
                    disabled={!selectedPool || amountBN.eq(0) || invalidAmount.isInvalid}
                    onClick={(_e) => {
                        if (!makeTrade) {
                            return;
                        }
                        makeTrade()
                    }}
                >
                    Ok, let&apos;s {actionType === CommitActionEnum.mint ? 'mint' : 'burn'}
                </Button>
            );
        }
    };

    return <>{ButtonContent()}</>;
};

export default ExchangeButton;

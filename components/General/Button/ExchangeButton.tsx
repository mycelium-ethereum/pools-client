import React from 'react';
import styled from 'styled-components';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import { swapDefaults, useSwapContext } from '@context/SwapContext';
import { usePool, usePoolActions } from '@context/PoolContext';
import { LONG, LONG_BURN, LONG_MINT, SHORT_BURN, SHORT_MINT } from '@libs/constants';
import Button from '@components/General/Button';

const ExchangeButton: React.FC<{ mintOrBurn: 'mint' | 'burn' }> = ({ mintOrBurn }) => {
    const { account } = useWeb3();
    const { handleConnect } = useWeb3Actions();
    const { swapState = swapDefaults } = useSwapContext();
    const { selectedPool, side, amount } = swapState;

    const pool = usePool(selectedPool);

    const { commit, approve } = usePoolActions();

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
        if (pool.quoteToken.approved) {
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
                            approve(selectedPool ?? '');
                        }}
                    >
                        Unlock USDC
                    </Button>
                    <HelperText>
                        Unlock DAI to start investing with Tracer. This is a one-time transaction for each pool.{' '}
                        <a>Learn more.</a>
                    </HelperText>
                </>
            );
        } else {
            return (
                <Button
                    size="lg"
                    variant="primary"
                    disabled={!selectedPool || !pool.quoteToken.approved || !amount}
                    onClick={(_e) => {
                        if (!commit) {
                            return;
                        } else if (mintOrBurn === 'mint') {
                            commit(selectedPool ?? '', side === LONG ? LONG_MINT : SHORT_MINT, amount);
                        } else if (mintOrBurn === 'burn') {
                            commit(selectedPool ?? '', side === LONG ? LONG_BURN : SHORT_BURN, amount);
                        }
                    }}
                >
                    Ok, let&apos;s buy
                </Button>
            );
        }
    };

    return <>{ButtonContent()}</>;
};

export default ExchangeButton;

const HelperText = styled.p`
    color: #6b7280;
    font-size: 14px;

    a {
        text-decoration: underline;
        cursor: pointer;
    }
`;

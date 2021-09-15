import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Button from '@components/General/Button';
import Gas from '@archetypes/Exchange/Gas';
import Close from '/public/img/general/close-black.svg';
import { TWModal } from '@components/General/TWModal';
import { tokenSymbolToLogoTicker } from '@components/General';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Currency } from '@components/General/Currency';
import { Input as NumericInput } from '@components/General/Input/Numeric';
import { StakeAction, StakeState } from '../state';
interface StakeModalProps {
    state: StakeState;
    dispatch: React.Dispatch<StakeAction>;
    onStake: (farmAddress: string, amount: number) => void;
    onApprove: (farmAddress: string) => void;
    title: string;
    btnLabel: string;
}

/* HELPER FUNCTIONS */
const isInvalidAmount: (amount: number, balance: number) => { isInvalid: boolean; message?: string } = (
    amount,
    balance,
) => {
    if (amount > balance) {
        return {
            message: undefined,
            isInvalid: true,
        };
    }

    return {
        message: undefined,
        isInvalid: false,
    };
};

const StakeModal: React.FC<StakeModalProps> = ({ state, dispatch, onStake, onApprove, title, btnLabel }) => {
    const { amount, selectedFarm, invalidAmount } = state;

    useEffect(() => {
        if (selectedFarm) {
            console.log('AVAILABLE TO STAKE', selectedFarm.stakingTokenBalance.toString());

            const invalidAmount = isInvalidAmount(amount, selectedFarm.stakingTokenBalance.toNumber());

            dispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [amount, selectedFarm]);

    console.log('SELECTED FARM', selectedFarm);

    const isApproved = useMemo(() => selectedFarm?.stakingTokenAllowance.gt(0), [selectedFarm]);

    return (
        <TWModal
            open={state.stakeModalState !== 'closed'}
            onClose={() => dispatch({ type: 'setStakeModalState', state: 'closed' })}
        >
            <div className="p-6">
                <div className="flex justify-between">
                    <StakeModalHeader>{title || 'Stake Pool Tokens'}</StakeModalHeader>
                    <Gas />
                    <div
                        className="w-3 h-3 ml-4 cursor-pointer"
                        onClick={() => dispatch({ type: 'setStakeModalState', state: 'closed' })}
                    >
                        <Close />
                    </div>
                </div>
                <div className="w-full">
                    <p className="mb-4 mt-6 text-black font-semibold">Amount</p>
                    <InputContainer error={false /* invalidAmount.isInvalid */}>
                        <NumericInput
                            disabled={!isApproved}
                            className="w-full h-full text-base font-normal "
                            value={amount}
                            onUserInput={(val) => dispatch({ type: 'setAmount', amount: parseFloat(val) })}
                        />
                        <InnerInputText>
                            <Currency
                                label={selectedFarm?.name}
                                ticker={tokenSymbolToLogoTicker(selectedFarm?.name)}
                                className="shadow-md"
                            />
                            <div
                                className={
                                    isApproved
                                        ? 'm-auto cursor-pointer hover:underline'
                                        : 'm-auto cursor-disabled text-gray-800'
                                }
                                onClick={(_e) =>
                                    dispatch({
                                        type: 'setAmount',
                                        amount: selectedFarm.stakingTokenBalance.toNumber(), // TODO use actual use balance here
                                    })
                                }
                            >
                                Max
                            </div>
                        </InnerInputText>
                    </InputContainer>
                    {isApproved ? (
                        <div className={invalidAmount.isInvalid ? 'text-red-500 ' : ''}>
                            {invalidAmount.isInvalid && invalidAmount.message ? (
                                invalidAmount.message
                            ) : (
                                <>
                                    {`Available: ${selectedFarm?.stakingTokenBalance.toFixed(6)}`}
                                    {!!amount ? ` > ${selectedFarm?.stakingTokenBalance.minus(amount).toFixed(6)}` : ''}
                                </>
                            )}
                        </div>
                    ) : (
                        <div>Token approval required</div>
                    )}
                    {isApproved ? (
                        <Button
                            className="mt-8"
                            size="lg"
                            variant="primary"
                            // disabled={!selectedPool || !amount || invalidAmount.isInvalid}
                            onClick={(_e) => onStake(selectedFarm.address, amount)}
                        >
                            {btnLabel}
                        </Button>
                    ) : (
                        <Button
                            className="mt-8"
                            size="lg"
                            variant="primary"
                            // disabled={!selectedPool || !amount || invalidAmount.isInvalid}
                            onClick={(_e) => onApprove(selectedFarm.address)}
                        >
                            Approve
                        </Button>
                    )}
                </div>
            </div>
        </TWModal>
    );
};

const StakeModalHeader = styled.h2`
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    color: #111928;
    padding-bottom: 1.3rem;
`;

export default StakeModal;

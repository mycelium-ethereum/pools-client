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
import { useFarms } from '@context/FarmContext';
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
    const { amount, selectedFarm, invalidAmount, stakeModalBalance } = state;
    const { poolFarms, slpFarms } = useFarms();

    const farm = useMemo(
        () => console.log('farm changed') || poolFarms[selectedFarm] || slpFarms[selectedFarm],
        [selectedFarm, poolFarms, slpFarms],
    );

    useEffect(() => {
        if (farm) {
            console.log('AVAILABLE TO STAKE', farm.stakingTokenBalance.toString());

            const invalidAmount = isInvalidAmount(amount, farm.stakingTokenBalance.toNumber());

            dispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [amount, farm]);

    console.log('SELECTED FARM', farm);

    const isApproved = useMemo(() => {
        return state.stakeModalState === 'claim' || state.stakeModalState === 'unstake' || stakeModalBalance.gt(0);
    }, [selectedFarm, state.stakeModalState]);

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
                    <p className="mb-4 mt-6 text-black font-semibold">
                        {state.stakeModalState === 'claim' ? 'Available to claim' : 'Amount'}
                    </p>
                    {state.stakeModalState !== 'claim' ? (
                        <InputContainer error={false /* invalidAmount.isInvalid */}>
                            <NumericInput
                                disabled={!isApproved}
                                className="w-full h-full text-base font-normal "
                                value={amount}
                                onUserInput={(val) => dispatch({ type: 'setAmount', amount: parseFloat(val) })}
                            />
                            <InnerInputText>
                                <Currency
                                    label={farm?.name}
                                    ticker={tokenSymbolToLogoTicker(farm?.name)}
                                    className="shadow-md"
                                />
                                <div
                                    className={
                                        !isApproved
                                            ? 'm-auto cursor-disabled text-gray-800'
                                            : 'm-auto cursor-pointer hover:underline'
                                    }
                                    onClick={(_e) =>
                                        dispatch({
                                            type: 'setAmount',
                                            amount: stakeModalBalance.toNumber(), // TODO use actual use balance here
                                        })
                                    }
                                >
                                    Max
                                </div>
                            </InnerInputText>
                        </InputContainer>
                    ) : (
                        <AvailableToClaim>{stakeModalBalance?.toFixed()}</AvailableToClaim>
                    )}
                    {isApproved && state.stakeModalState !== 'claim' ? (
                        <div className={invalidAmount.isInvalid ? 'text-red-500 ' : ''}>
                            {invalidAmount.isInvalid && invalidAmount.message ? (
                                invalidAmount.message
                            ) : (
                                <>
                                    {`Available: ${stakeModalBalance?.toFixed(6)}`}
                                    {!!amount ? ` > ${stakeModalBalance?.minus(amount).toFixed(6)}` : ''}
                                </>
                            )}
                        </div>
                    ) : (
                        <>{state.stakeModalState !== 'claim' ? 'Token approval required' : ''}</>
                    )}
                    {isApproved ? (
                        <Button
                            className="mt-8"
                            size="lg"
                            variant="primary"
                            disabled={!amount || stakeModalBalance.eq(0) || invalidAmount.isInvalid}
                            onClick={(_e) => onStake(farm.address, amount)}
                        >
                            {btnLabel}
                        </Button>
                    ) : (
                        <Button className="mt-8" size="lg" variant="primary" onClick={(_e) => onApprove(farm.address)}>
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

const AvailableToClaim = styled.p`
    font-size: 24px;
`;

export default StakeModal;

import React, { useEffect } from 'react';
import Button from '@components/General/Button';
import styled from 'styled-components';
import { TWModal } from '@components/General/TWModal';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Input } from '@components/General/Input/Numeric';
import { StakeAction, StakeState } from '../state';

interface StakeModalProps {
    state: StakeState;
    dispatch: React.Dispatch<StakeAction>;
    onStake: (farmAddress: string, amount: number) => void;
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

const StakeModal: React.FC<StakeModalProps> = ({ state, dispatch, onStake }) => {
    const { amount, selectedFarm, invalidAmount } = state;

    useEffect(() => {
        if (selectedFarm) {
            console.log('AVAILABLE TO STAKE', selectedFarm.availableToStake.toString());

            const invalidAmount = isInvalidAmount(amount, selectedFarm.availableToStake.toNumber());

            dispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [amount, selectedFarm]);

    console.log('SELECTED FARM', selectedFarm);

    return (
        <TWModal open={state.stakeModalOpen} onClose={() => dispatch({ type: 'setStakeModalOpen', open: false })}>
            <div className="p-6">
                <div className="w-full">
                    <StakeModalHeader>Stake Pool Tokens</StakeModalHeader>
                    <p className="mb-2 text-black">Amount</p>
                    <InputContainer className="w-full ">
                        <Input
                            className="w-full h-full text-xl font-normal "
                            value={amount}
                            type="number"
                            onUserInput={(val) => {
                                dispatch({ type: 'setAmount', amount: Number(val) });
                            }}
                        />
                        <InnerInputText>
                            <div
                                className="m-auto cursor-pointer hover:underline"
                                onClick={(_e) =>
                                    dispatch({
                                        type: 'setAmount',
                                        amount: selectedFarm.availableToStake.toNumber(), // TODO use actual use balance here
                                    })
                                }
                            >
                                Max
                            </div>
                        </InnerInputText>
                    </InputContainer>
                    <div className={invalidAmount.isInvalid ? 'text-red-500 ' : ''}>
                        {invalidAmount.isInvalid && invalidAmount.message ? (
                            invalidAmount.message
                        ) : (
                            <>
                                {`Available: ${selectedFarm?.availableToStake.toFixed(6)}`}
                                {!!amount ? ` > ${selectedFarm?.availableToStake.minus(amount).toFixed(6)}` : ''}
                            </>
                        )}
                    </div>
                    <Button
                        className="mt-6"
                        size="default"
                        variant="primary"
                        onClick={() => onStake(selectedFarm.address, amount)}
                    >
                        Stake
                    </Button>
                    {/* <p className={invalidAmount.isInvalid ? 'text-red-500 ' : ''}>
                    {invalidAmount.isInvalid && invalidAmount.message ? (
                        invalidAmount.message
                    ) : (
                        <>
                            Available:{' '}
                            {side === SideEnum.long
                                ? pool.longToken.balance.toFixed(2)
                                : pool.shortToken.balance.toFixed(2)}{' '}
                            {!!amount
                                ? `> ${
                                      side === SideEnum.long
                                          ? isNaN(amount)
                                              ? pool.longToken.balance.toFixed(2)
                                              : (pool.longToken.balance.toNumber() - amount).toFixed(2)
                                          : isNaN(amount)
                                          ? pool.shortToken.balance.toFixed(2)
                                          : (pool.shortToken.balance.toNumber() - amount).toFixed(2)
                                  }`
                                : null}
                        </>
                    )}
                </p> */}
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

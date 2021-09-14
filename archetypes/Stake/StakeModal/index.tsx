import React from 'react';
import { TWModal } from '@components/General/TWModal';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Input } from '@components/General/Input/Numeric';
import { StakeAction, StakeState } from '../state';

interface StakeModalProps {
    state: StakeState;
    dispatch: React.Dispatch<StakeAction>;
}

const StakeModal: React.FC<StakeModalProps> = ({ state, dispatch }) => {
    const { amount } = state;

    return (
        <TWModal open={state.stakeModalOpen} onClose={() => dispatch({ type: 'setStakeModalOpen', open: false })}>
            <div className="w-full">
                <p className="mb-2 text-black">Amount</p>
                <InputContainer className="w-full ">
                    <Input
                        className="w-full h-full text-xl font-normal "
                        value={amount}
                        type="number"
                        onUserInput={(val) => {
                            dispatch({ type: 'setAmount', amount: parseInt(val) });
                        }}
                    />
                    <InnerInputText>
                        <div
                            className="m-auto cursor-pointer hover:underline"
                            onClick={(_e) =>
                                dispatch({
                                    type: 'setAmount',
                                    amount: 10000, // TODO use actual use balance here
                                })
                            }
                        >
                            Max
                        </div>
                    </InnerInputText>
                </InputContainer>
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
        </TWModal>
    );
};

export default StakeModal;

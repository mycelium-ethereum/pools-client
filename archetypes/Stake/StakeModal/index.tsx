import React, { useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import Button from '@components/General/Button';
import Close from '/public/img/general/close.svg';
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
    onStake: (farmAddress: string, amount: BigNumber) => void;
    onApprove: (farmAddress: string) => void;
    title: string;
    btnLabel: string;
}

/* HELPER FUNCTIONS */
const isInvalidAmount: (amount: BigNumber, balance: BigNumber) => { isInvalid: boolean; message?: string } = (
    amount,
    balance,
) => {
    if (amount.gt(balance)) {
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
    const { farms } = useFarms();

    const farm = useMemo(() => farms[selectedFarm], [selectedFarm, farms]);

    const stakingTokenAllowance = farm ? farm.stakingTokenAllowance : new BigNumber(0);

    useEffect(() => {
        if (farm) {
            const invalidAmount = isInvalidAmount(amount, stakeModalBalance);

            dispatch({
                type: 'setInvalidAmount',
                value: invalidAmount,
            });
        }
    }, [amount, farm]);

    const isApproved = useMemo(() => {
        return state.stakeModalState === 'claim' || state.stakeModalState === 'unstake' || stakingTokenAllowance?.gt(0);
    }, [selectedFarm, state.stakeModalState, farm]);

    return (
        <TWModal
            open={state.stakeModalState !== 'closed'}
            onClose={() => dispatch({ type: 'setStakeModalState', state: 'closed' })}
        >
            <div className="flex justify-between pb-6">
                <div className="font-bold text-2xl">{title || 'Stake Tracer Pool Tokens'}</div>
                {/* <Gas /> */}
                <div
                    className="w-3 h-3 ml-4 cursor-pointer"
                    onClick={() => dispatch({ type: 'setStakeModalState', state: 'closed' })}
                >
                    <Close />
                </div>
            </div>
            <div className="w-full">
                <p className="mb-4 mt-6  font-semibold">
                    {state.stakeModalState === 'claim' ? 'Available to claim' : 'Amount'}
                </p>
                {state.stakeModalState !== 'claim' ? (
                    <InputContainer>
                        <NumericInput
                            disabled={!isApproved}
                            className="w-full h-full text-base font-normal "
                            value={amount.eq(0) ? '' : amount.toFixed()}
                            onUserInput={(val) => dispatch({ type: 'setAmount', amount: new BigNumber(val || 0) })}
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
                                        amount: stakeModalBalance,
                                    })
                                }
                            >
                                Max
                            </div>
                        </InnerInputText>
                    </InputContainer>
                ) : (
                    <div className="text-2xl">{stakeModalBalance?.toFixed()}</div>
                )}
                {isApproved && state.stakeModalState !== 'claim' ? (
                    <div className={invalidAmount.isInvalid ? 'text-red-500 ' : ''}>
                        {invalidAmount.isInvalid && invalidAmount.message ? (
                            invalidAmount.message
                        ) : (
                            <>
                                {`Available: ${stakeModalBalance?.toFixed(6)}`}
                                {!amount.eq(0) ? ` >>> ${stakeModalBalance?.minus(amount).toFixed(6)}` : ''}
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
                        disabled={amount.eq(0) || stakeModalBalance.eq(0) || invalidAmount.isInvalid}
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
        </TWModal>
    );
};

export default StakeModal;

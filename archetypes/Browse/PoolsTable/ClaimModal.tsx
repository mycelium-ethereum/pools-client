import Button from '@components/General/Button';
import { toApproxCurrency } from '@libs/utils/converters';
import React from 'react';
import { BrowseTableRowData } from '../state';
import Modal from '@components/General/Modal';
import Gas from '@archetypes/Exchange/Gas';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Input as NumericInput } from '@components/General/Input/Numeric';

import Close from '/public/img/general/close-black.svg';
import { Currency } from '@components/General/Currency';
import { usePool } from '@context/PoolContext';
import { swapDefaults, useSwapContext } from '@context/SwapContext';

export default (({ token, onClick, showModal, setShowModal }) => {
    const hasHoldings = token.myHoldings > 0;

    const { swapState = swapDefaults, swapDispatch } = useSwapContext();
    const { selectedPool, side, amount, invalidAmount } = swapState;
    const pool = usePool(selectedPool);

    return (
        <>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="flex justify-between">
                    <div className="text-2xl">Claim Rewards</div>
                    <Gas />
                    <div className="w-3 h-3 ml-4 cursor-pointer self-center" onClick={() => setShowModal(false)}>
                        <Close />
                    </div>
                </div>
                <p className="mb-4 mt-6 text-black font-semibold">Amount</p>
                <InputContainer error={false /* invalidAmount.isInvalid */}>
                    <NumericInput
                        className="w-full h-full text-base font-normal "
                        value={amount}
                        onUserInput={(val) => {
                            // TODO: 
                            // e.g. swapDispatch({ type: 'setAmount', value: parseFloat(val) });
                        }}
                    />
                    <InnerInputText>
                        {/* TODO: No Tracer Token Label, add one inplace of TSLA */}
                        <Currency label={"TRC"} ticker={"TSLA"} className="shadow-md" />
                        <div
                            className="m-auto cursor-pointer hover:underline"
                            onClick={(_e) =>
                                // TODO:
                                // e.g. swapDispatch({ type: 'setAmount', value: pool.quoteToken.balance.toNumber() })
                                null
                            }
                        >
                            Max
                        </div>
                    </InnerInputText>
                </InputContainer>
                {/* TODO:  */}
                <div className={ (false /* invalidAmount.isInvalid */ ? 'text-red-500 ' : '') + 'mt-4 mb-12'}>
                    { false /* invalidAmount.isInvalid */ &&  ""/* invalidAmount.message */ ? (
                            ""/* invalidAmount.message */
                    ) : (
                        <>
                            {/* TODO: this probably isn't correct */}
                            {`Available: ${toApproxCurrency(pool.quoteToken.balance)}`}
                            {!!amount ? ` > ${toApproxCurrency(pool.quoteToken.balance.minus(amount))}` : ''}
                        </>
                    )}
                </div>
                <Button
                    size="lg"
                    variant="primary"
                    // disabled={!selectedPool || !amount || invalidAmount.isInvalid}
                    disabled={!hasHoldings}
                    onClick={(_e) => onClick()}
                >
                    Claim
                </Button>
            </Modal>
        </>
    );

}) as React.FC<{
    token: BrowseTableRowData;
    showModal: Boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    ;
    onClick: () => void;
}>;
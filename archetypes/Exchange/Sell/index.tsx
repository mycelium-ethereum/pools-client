import React, { useState } from 'react';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Dropdown } from '@components/General/Dropdown';
import { Input } from '@components/General/Input/Numeric';
import { useSwapContext, swapDefaults, noDispatch } from '@context/SwapContext';
import { ExchangeButton } from '../Inputs';
import { usePool, usePoolActions } from '@context/PoolContext';
import { LONG, LONG_BURN, SHORT_BURN } from '@libs/constants';
import SelectToken from '@components/SelectToken';
import { SellSummary } from '../Summary';
import useEstimatedGasFee from '@libs/hooks/useEstimatedGasFee';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { toCommitType } from '@libs/utils/converters';
import { SideType } from '@libs/types/General';

export default (() => {
    const [showTokenSelect, setShowTokenSelect] = useState(false);
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
    const { commit } = usePoolActions();
    const tokens = usePoolTokens();

    const { amount, side, selectedPool, commitAction } = swapState;

    const pool = usePool(selectedPool);
    const gasFee = useEstimatedGasFee(pool.committer.address, amount, toCommitType(side, commitAction));

    return (
        <>
            <div className="relative flex justify-between my-2 ">
                <span className="w-full md:w-1/2">
                    <p className="mb-2 text-black">Token</p>
                    <Dropdown
                        className="w-full "
                        placeHolder="Select Token"
                        size="lg"
                        options={tokens.map((token) => token.symbol)}
                        value={side === LONG ? pool.longToken.symbol : pool.shortToken.symbol}
                        onSelect={(option) => {
                            tokens.forEach((token) => {
                                if (token.symbol === option) {
                                    console.log('Setting pool', token.pool, token.side);
                                    swapDispatch({ type: 'setSelectedPool', value: token.pool as string });
                                    swapDispatch({ type: 'setSide', value: token.side as SideType });
                                }
                            });
                        }}
                    />
                </span>
                <span className="w-full md:w-56 ml-2">
                    <p className="mb-2 text-black">Amount</p>
                    <InputContainer className="w-full ">
                        <Input
                            className="w-full h-full text-xl font-normal "
                            value={amount}
                            onUserInput={(val) => {
                                swapDispatch({ type: 'setAmount', value: parseInt(val) });
                            }}
                        />
                        <InnerInputText>
                            <div
                                className="m-auto cursor-pointer hover:underline"
                                onClick={(_e) =>
                                    swapDispatch({
                                        type: 'setAmount',
                                        value:
                                            side === LONG
                                                ? pool.longToken.balance.toNumber()
                                                : pool.shortToken.balance.toNumber(),
                                    })
                                }
                            >
                                Max
                            </div>
                        </InnerInputText>
                    </InputContainer>
                </span>
            </div>

            <SellSummary pool={pool} isLong={side === LONG} amount={amount} gasFee={gasFee} />

            <ExchangeButton
                className="primary"
                disabled={!amount || !selectedPool}
                onClick={(_e) => {
                    if (!commit) {
                        return;
                    }
                    commit(selectedPool ?? '', side === LONG ? LONG_BURN : SHORT_BURN, amount);
                }}
            >
                Sell
            </ExchangeButton>

            <SelectToken show={showTokenSelect} onClose={() => setShowTokenSelect(false)} />
        </>
    );
}) as React.FC;

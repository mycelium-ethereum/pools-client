import React from 'react';
import { InnerInputText, InputContainer } from '@components/General/Input';
import { Dropdown } from '@components/General/Dropdown';
import { Input } from '@components/General/Input/Numeric';
import { useSwapContext, swapDefaults, noDispatch } from '@context/SwapContext';
import { usePool } from '@context/PoolContext';
import { LONG, BURN } from '@libs/constants';
import { SellSummary } from '../Summary';
import useEstimatedGasFee from '@libs/hooks/useEstimatedGasFee';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { toApproxCurrency, toCommitType } from '@libs/utils/converters';
import { SideType } from '@libs/types/General';
import ExchangeButton from '@components/General/Button/ExchangeButton';

export default (() => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();
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
                        options={tokens.map((token) => ({ key: token.symbol }))}
                        value={side === LONG ? pool.longToken.symbol : pool.shortToken.symbol}
                        onSelect={(option) => {
                            tokens.forEach((token) => {
                                if (token.symbol === option) {
                                    swapDispatch({ type: 'setSelectedPool', value: token.pool as string });
                                    swapDispatch({ type: 'setSide', value: token.side as SideType });
                                }
                            });
                        }}
                    />
                    <p>Last Price: {toApproxCurrency(pool.lastPrice)}</p>
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
                    <p>
                        Available:{' '}
                        {side === LONG ? pool.longToken.balance.toFixed(2) : pool.shortToken.balance.toFixed(2)} {'>>'}{' '}
                        {side === LONG
                            ? isNaN(amount)
                                ? pool.longToken.balance.toFixed(2)
                                : (pool.longToken.balance.toNumber() - amount).toFixed(2)
                            : isNaN(amount)
                            ? pool.shortToken.balance.toFixed(2)
                            : (pool.shortToken.balance.toNumber() - amount).toFixed(2)}
                    </p>
                </span>
            </div>

            <SellSummary pool={pool} isLong={side === LONG} amount={amount} gasFee={gasFee} />

            <ExchangeButton mintOrBurn={BURN} />
        </>
    );
}) as React.FC;

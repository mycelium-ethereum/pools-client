import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, SelectOption } from '@components/General/Input';
import { useSwapContext, swapDefaults, noDispatch } from '@context/SwapContext';
import { ExchangeButton, InputRow, MarketSelect } from '../Inputs';
import { usePool, usePoolActions } from '@context/PoolContext';
import { LONG, LONG_BURN, SHORT_BURN } from '@libs/constants';
import SelectToken from '@components/SelectToken';
import { SellSummary } from '../Summary';
import useEstimatedGasFee from '@libs/hooks/useEstimatedGasFee';
import usePoolTokens from '@libs/hooks/usePoolTokens';
import { toCommitType } from '@libs/utils/converters';

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
            <StyledInputRow>
                <span>
                    <p className="mb-2 text-black">Token</p>
                    <MarketSelect
                        preview={side === LONG ? pool.longToken.symbol : pool.shortToken.symbol}
                        onChange={(e: any) => {
                            const [pool, side] = e.target.value.split('-');
                            console.log('Setting pool', pool, side);
                            swapDispatch({ type: 'setSelectedPool', value: pool as string });
                            swapDispatch({ type: 'setSide', value: parseInt(side) });
                        }}
                    >
                        {tokens.map((token) => (
                            <SelectOption
                                key={`pool-dropdown-option-${token.pool}-${token.side}`}
                                value={`${token.pool}-${token.side}`}
                                selected={selectedPool === token.pool && side === token.side}
                            >
                                {token.symbol}
                            </SelectOption>
                        ))}
                    </MarketSelect>
                </span>
                <div className="relative">
                    <p className="mb-2 text-black">Amount</p>
                    <Input
                        value={amount}
                        onChange={(e: any) => {
                            swapDispatch({ type: 'setAmount', value: parseInt(e.currentTarget.value) });
                        }}
                        type={'number'}
                        min={0}
                    />
                </div>
            </StyledInputRow>

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

const StyledInputRow = styled(InputRow)`
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;

    ${MarketSelect} {
        width: 245px;
        height: 3.44rem; // 55px
        line-height: 3.44rem; // 55px
    }

    ${Input} {
        max-width: 220px;
        width: 100%;
    }
`;

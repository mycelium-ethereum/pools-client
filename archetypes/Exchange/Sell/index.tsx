import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Select, SelectOption } from '@components/General/Input';
import { useSwapContext, swapDefaults, noDispatch } from '@context/SwapContext';
import { ExchangeButton, InputContainer, InputRow } from '../Inputs';
import { usePool, usePoolActions } from '@context/PoolContext';
import { LONG, LONG_BURN, SHORT_BURN } from '@libs/constants';
import { Label } from '@components/Pool';
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

<<<<<<< HEAD
    const { amount, side, selectedPool, commitAction } = swapState;
=======
    const {
        amount,
        selectedPool,
        side,
        commitAction,
    } = swapState;
>>>>>>> e10ecf3... Update connection modal (#3)

    const pool = usePool(selectedPool);
    const gasFee = useEstimatedGasFee(pool.committer.address, amount, toCommitType(side, commitAction));

    return (
        <>
            <StyledInputRow>
<<<<<<< HEAD
                <span>
                    <Label>Token</Label>
                    <Select
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
                    </Select>
=======
                <span
                >
                    <Label>Token</Label>
                    <MarketSelect
                        preview={pool.name}
                        onChange={(e: any) =>
                            swapDispatch({ type: 'setSelectedPool', value: e.target.value as string })
                        }
                    >
                        {poolOptions.map((pool) => (
                            <SelectOption
                                key={`pool-dropdown-option-${pool.address}`}
                                value={pool.address}
                                selected={selectedPool === pool.address}
                            >
                                {pool.name}
                            </SelectOption>
                        ))}
                    </MarketSelect>
>>>>>>> e10ecf3... Update connection modal (#3)
                </span>
                <InputContainer>
                    <Label>Amount</Label>
                    <Input
                        value={amount}
                        onChange={(e: any) => {
                            swapDispatch({ type: 'setAmount', value: parseInt(e.currentTarget.value) });
                        }}
                        type={'number'}
                        min={0}
                    />
                </InputContainer>
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

    ${Select} {
        width: 245px;
        height: 3.44rem; // 55px
        line-height: 3.44rem; // 55px
    }

    ${Input} {
        max-width: 220px;
        width: 100%;
    }
`;
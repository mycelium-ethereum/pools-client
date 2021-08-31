import React from 'react';
import styled from 'styled-components';
import { Input, Select, SelectOption } from '@components/General/Input';
import { useSwapContext, swapDefaults, noDispatch } from '@context/SwapContext';
import { ExchangeButton, InputContainer, Label } from '.';
import { usePool } from '@context/PoolContext';

export default (() => {
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();

    const {
        amount,
        selectedPool,
        options: { poolOptions },
    } = swapState;

    const pool = usePool(selectedPool);
    console.log('Selected address', pool?.address);

    return (
        <>
            <StyledInputContainer>
                <Label>Amount</Label>
                <Input
                    value={amount}
                    onChange={(e: any) => {
                        swapDispatch({ type: 'setAmount', value: parseInt(e.currentTarget.value) });
                    }}
                    type={'number'}
                    min={0}
                />
                <Select onChange={(e: any) => swapDispatch({ type: 'setSelectedPool', value: e.currentTarget.value })}>
                    {poolOptions.map((pool) => (
                        <SelectOption
                            key={`token-dropdown-option-${pool.address}`}
                            value={pool.address}
                            selected={selectedPool === pool?.address}
                        >
                            {pool.name}
                        </SelectOption>
                    ))}
                </Select>
            </StyledInputContainer>

            <ExchangeButton>Sell</ExchangeButton>
        </>
    );
}) as React.FC;

const StyledInputContainer = styled(InputContainer)`
    ${Select} {
        position: absolute;
        bottom: 0;
        right: 5px;
        border-radius: 7px;
    }
    ${Input} {
        height: 50px;
        width: 100%;
        border: 1px solid var(--color-accent);
        border-radius: 5px;
    }
`;

import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Select, SelectOption } from '@components/General/Input';
import { useSwapContext, swapDefaults, noDispatch } from '@context/SwapContext';
import { ExchangeButton, InputContainer, MarketSelect } from '.';
import { usePool } from '@context/PoolContext';
import { LONG } from '@libs/constants';
import Summary from '../Summary';
import { Label } from '@components/Pool';
import SelectToken from '@components/SelectToken';

export default (() => {
    const [showTokenSelect, setShowTokenSelect] = useState(false);
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();

    const {
        amount,
        selectedPool,
        side,
        options: { poolOptions },
    } = swapState;

    const pool = usePool(selectedPool);
    console.log('Selected address', pool?.address);

    return (
        <>
            <InputRow>
                <span
                >
                    <Label>Token</Label>
                    {/*<Select*/}
                    {/*    preview={pool.name}*/}
                    {/*    onChange={(e: any) =>*/}
                    {/*        swapDispatch({ type: 'setSelectedPool', value: e.target.value as string })*/}
                    {/*    }*/}
                    {/*/>*/}
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
            </InputRow>
            <Summary pool={pool} isLong={side === LONG} amount={amount} />
            <ExchangeButton className="primary" disabled={!amount || !selectedPool}>
                Sell
            </ExchangeButton>
            <SelectToken show={showTokenSelect} onClose={() => setShowTokenSelect(false)} />
        </>
    );
}) as React.FC;

const InputRow = styled.div`
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

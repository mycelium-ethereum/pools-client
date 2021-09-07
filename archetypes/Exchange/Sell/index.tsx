import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Select } from '@components/General/Input';
import { useSwapContext, swapDefaults, noDispatch } from '@context/SwapContext';
import { ExchangeButton, InputContainer, InputRow } from '../Inputs';
import { usePool } from '@context/PoolContext';
import { LONG } from '@libs/constants';
import { Label } from '@components/Pool';
import SelectToken from '@components/SelectToken';
import { SellSummary } from '../Summary';
import useEstimatedGasFee from '@libs/hooks/useEstimatedGasFee';
import { toCommitType } from '@libs/utils/converters';

export default (() => {
    const [showTokenSelect, setShowTokenSelect] = useState(false);
    const { swapState = swapDefaults, swapDispatch = noDispatch } = useSwapContext();

    const { amount, selectedPool, side, commitAction } = swapState;

    const pool = usePool(selectedPool);

    const gasFee = useEstimatedGasFee(pool.committer.address, amount, toCommitType(side, commitAction))

    return (
        <>
            <StyledInputRow>
                <span
                    onClick={() => {
                        setShowTokenSelect(true);
                    }}
                >
                    <Label>Token</Label>
                    <Select
                        preview={pool.name}
                        onChange={(e: any) =>
                            swapDispatch({ type: 'setSelectedPool', value: e.target.value as string })
                        }
                    ></Select>
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

            <ExchangeButton className="primary" disabled={!amount || !selectedPool}>
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

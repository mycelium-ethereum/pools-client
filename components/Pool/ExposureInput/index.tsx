import { Input, Select, SelectOption } from '@components/General';
import { CurrencyType } from '@libs/types/General';
import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import { SectionContainer, Label } from '..';

export default (({ selectedCurrency, amount, onInputChange, onSettlementChange, settlementOptions }) => {
    return (
        <SectionContainer>
            <Label>Amount</Label>
            <ExposureInputs>
                <Input value={Number.isNaN(amount) ? '' : amount} placeholder={'0.0'} onChange={onInputChange} />
                <Select value={selectedCurrency} onChange={onSettlementChange}>
                    {settlementOptions?.map((currency) => (
                        <SelectOption
                            key={`currency-${currency}`}
                            value={currency}
                            selected={currency === selectedCurrency}
                        >
                            {currency}
                        </SelectOption>
                    ))}
                </Select>
            </ExposureInputs>
        </SectionContainer>
    );
}) as React.FC<{
    selectedCurrency: CurrencyType;
    amount: number;
    onInputChange: ChangeEventHandler<HTMLInputElement>;
    onSettlementChange: ChangeEventHandler<HTMLSelectElement>;
    settlementOptions: string[];
}>;

const ExposureInputs = styled.div`
    ${Select} {
    }

    ${SelectOption} {
    }

    ${Input} {
    }
`;

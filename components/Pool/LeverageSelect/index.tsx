import { Select, SelectOption } from '@components/General';
import { SwapAction } from '@context/SwapContext';
import React, { ChangeEventHandler } from 'react';
import { SectionContainer, Label } from '..';

export default (({ selectedLeverage, options, onChange }) => {
    return (
        <SectionContainer>
            <Label>Leverage</Label>
            <Select value={selectedLeverage} onChange={onChange}>
                {options.map((leverage) => (
                    <SelectOption
                        key={`leverage-${leverage}`}
                        value={leverage}
                        selected={leverage === selectedLeverage}
                    >
                        {leverage}x
                    </SelectOption>
                ))}
            </Select>
        </SectionContainer>
    );
}) as React.FC<{
    selectedLeverage: number;
    swapDispatch: React.Dispatch<SwapAction>;
    onChange: ChangeEventHandler<HTMLSelectElement>;
    options: number[];
}>;

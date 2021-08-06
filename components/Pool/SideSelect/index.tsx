import { Select, SelectOption } from '@components/General';
import { SideType, SwapAction } from '@context/SwapContext';
import React from 'react';
import { SectionContainer, Label } from '..';

export default (({ selectedSide, swapDispatch }) => {
    return (
        <SectionContainer>
            <Label>Side</Label>
            <Select
                value={selectedSide}
                onChange={(e) => swapDispatch({ type: 'setSide', value: e.currentTarget.value as SideType })}
            >
                <SelectOption value={'Long'} selected={selectedSide === 'Long'}>
                    Long
                </SelectOption>
                <SelectOption value={'Short'} selected={selectedSide === 'Short'}>
                    Short
                </SelectOption>
            </Select>
        </SectionContainer>
    );
}) as React.FC<{
    selectedSide: SideType;
    swapDispatch: React.Dispatch<SwapAction>;
}>;

import { Select, SelectOption } from '@components/General/Input';
import { SwapAction } from '@context/SwapContext';
import { LONG, SHORT } from '@libs/constants';
import { SideType } from '@libs/types/General';
import React from 'react';
import { SectionContainer, Label } from '..';

export default (({ selectedSide, swapDispatch }) => {
    return (
        <SectionContainer>
            <Label>Side</Label>
            <Select
                value={selectedSide}
                onChange={(e) => swapDispatch({ type: 'setSide', value: parseInt(e.currentTarget.value) as SideType })}
            >
                <SelectOption value={LONG} selected={selectedSide === LONG}>
                    Long
                </SelectOption>
                <SelectOption value={SHORT} selected={selectedSide === SHORT}>
                    Short
                </SelectOption>
            </Select>
        </SectionContainer>
    );
}) as React.FC<{
    selectedSide: SideType;
    swapDispatch: React.Dispatch<SwapAction>;
}>;

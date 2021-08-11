import { Select, SelectOption } from '@components/General';
import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import { SectionContainer } from '..';

export default (({ selectedMarket, tokens, onChange }) => {
    return (
        <SectionContainer>
            <Label>Token</Label>
            <Select value={selectedMarket} onChange={onChange}>
                {tokens?.map((token) => (
                    <SelectOption key={`token-${token}`} value={token} selected={selectedMarket === token}>
                        {token}
                    </SelectOption>
                ))}
            </Select>
        </SectionContainer>
    );
}) as React.FC<{
    selectedMarket: string;
    tokens: string[];
    onChange: ChangeEventHandler<HTMLSelectElement>;
}>;

const Label = styled.p``;

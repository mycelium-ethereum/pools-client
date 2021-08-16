import SlideSelect, { Option } from '@components/General/SlideSelect';
import { SwapAction } from '@context/SwapContext';
import { TokenType } from '@libs/types/General';
import { BURN, MINT } from '@libs/constants';
import React from 'react';
import { SectionContainer } from '..';

export default (({ tokenType, swapDispatch }) => {
    return (
        <SectionContainer>
            <SlideSelect
                onClick={(index) => swapDispatch({ type: 'setTokenType', value: index as TokenType })}
                value={tokenType}
            >
                <Option>Mint</Option>
                <Option>Burn</Option>
            </SlideSelect>
        </SectionContainer>
    );
}) as React.FC<{
    tokenType: typeof MINT | typeof BURN;
    swapDispatch: React.Dispatch<SwapAction>;
}>;

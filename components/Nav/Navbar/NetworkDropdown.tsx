import React from 'react';
import { Select, SelectOption } from '@components/General/Input';
import { Logo } from '@components/General';
import { ARBITRUM } from '@libs/constants';
import styled from 'styled-components';

export default styled(({ className }) => {
    return (
        <Select className={className} preview={<NetworkPreview networkID={ARBITRUM} networkName={'Arbitrum'} />}>
            <SelectOption>Arbitrum</SelectOption>
        </Select>
    );
})`
    border: 1px solid #ffffff;
    box-sizing: border-box;
    border-radius: 7px;
    background: transparent;
    margin: auto 1rem;
    width: 158px;
    height: 2.625rem;

    & svg {
        fill: #fff;
    }
`;

const NetworkPreview = styled(({ networkID, networkName, className }) => {
    return (
        <div className={className}>
            <Logo ticker={networkID} />
            {networkName}
        </div>
    );
})`
    color: #fff;
    display: flex;
    line-height: 2.625rem;
    ${Logo} {
        display: inline;
        vertical-align: 0;
        width: 20px;
        height: 22px;
        margin: auto 0.5rem auto 0;
    }
`;

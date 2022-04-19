import React from 'react';
import styled from 'styled-components';
import { device, fontSize } from '~/store/ThemeSlice/themes';

export default (({ hideOnDesktop }) => (
    <VersionToggle hideOnDesktop={hideOnDesktop}>
        <V1 href="https://pools.tracer.finance">V1</V1>
        <V2>
            V2 <New>BETA</New>
        </V2>
    </VersionToggle>
)) as React.FC<{
    hideOnDesktop?: boolean;
}>;

const VersionToggle = styled.span<{ hideOnDesktop?: boolean }>`
    border: 1px solid #fff;
    border-radius: 7px;
    background-color: rgba(255, 255, 255, 0.25);
    color: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    margin: 10px 0 10px 10px;
    width: 149px;
    justify-content: space-between;
    font-weight: 600;
    letter-spacing: 0.115em;

    @media ${device.lg} {
        display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'grid')};
        margin: 10px 0 10px 10px;
    }
`;

const V1 = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    &:hover {
        color: #fff;
    }
`;

const V2 = styled.span`
    background-color: #fff;
    color: #3535dc;
    border-radius: 5px;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px;
    white-space: nowrap;
`;

const New = styled.span`
    background-color: #3535dc;
    color: #fff;
    font-size: ${fontSize.xxxs};
    font-weight: 700;
    border-radius: 3px;
    padding: 0 4px;
    margin-left: 3px;
    height: 13px;
    display: flex;
    align-items: center;
    margin-bottom: -1px;
    letter-spacing: 0;
`;

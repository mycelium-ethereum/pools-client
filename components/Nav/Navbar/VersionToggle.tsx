import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

type VersionToggleProps = {
    pushContentRight: boolean;
    hideOnDesktop?: boolean;
};

export const VersionToggle = ({ hideOnDesktop, pushContentRight }: VersionToggleProps): JSX.Element => {
    const router = useRouter();
    return (
        <StyledVersionToggle hideOnDesktop={hideOnDesktop} pushContentRight={pushContentRight}>
            <V1>V1</V1>
            <V2 href={`https://pools.tracer.finance${router.route}`}>V2</V2>
        </StyledVersionToggle>
    );
};

export default VersionToggle;

const StyledVersionToggle = styled.span<{ hideOnDesktop?: boolean; pushContentRight: boolean }>`
    border: 1px solid #fff;
    border-radius: 7px;
    background-color: rgba(255, 255, 255, 0.25);
    color: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    margin: ${({ pushContentRight }) => `10px 0 10px ${pushContentRight ? '10px' : 'auto'}`};
    width: 149px;
    justify-content: space-between;
    font-weight: 600;
    letter-spacing: 0.115em;
    @media (min-width: 1280px) {
        display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'grid')};
        margin: 10px 0 10px 10px;
    }
    margin-right: 12px;
`;

const V1 = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    background-color: #fff;
    color: #3535dc;
    border-radius: 5px;
`;

const V2 = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    &:hover {
        color: #fff;
    }
`;

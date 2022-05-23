import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

type VersionToggleProps = {
    hideOnDesktop?: boolean;
};

const basePath = 'https://poolsv1.tracer.finance';
export const VersionToggle = ({ hideOnDesktop }: VersionToggleProps): JSX.Element => {
    const router = useRouter();

    const getRoute = useCallback(() => {
        if (router.route === '/') {
            return `${basePath}/pools`;
        } else {
            // assumes that the destination base path appropriately handles redirects
            return `${basePath}${router.route}`;
        }
    }, [router.route]);

    return (
        <StyledVersionToggle hideOnDesktop={hideOnDesktop}>
            <V1 href={getRoute()}>V1</V1>
            <V2>V2</V2>
        </StyledVersionToggle>
    );
};

export default VersionToggle;

const StyledVersionToggle = styled.span<{ hideOnDesktop?: boolean }>`
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

    @media (min-width: 1024px) {
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
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #fff;
    color: #3535dc;
    border-radius: 5px;
`;

import styled from 'styled-components';
import { default as UnstyledButton } from '~/components/General/Button';
import { default as UnstyledLoading } from '~/components/General/Loading';

export const Loading = styled(UnstyledLoading)`
    margin: 2.5rem auto 0;
    width: 2.5rem;
`;

export const DataRow = styled.div`
    padding: 1rem;
    margin-bottom: 2.5rem;
    border-radius: 0.25rem;
    border-width: 0.0625rem;
    border-color: ${({ theme }) => theme.border.primary};
    background-color: ${({ theme }) => theme.background.primary};
    @media ${({ theme }) => theme.device.sm} {
        border-radius: 0.25rem;
    }
    @media ${({ theme }) => theme.device.md} {
        padding: 1rem;
        border-radius: 0.25rem;
    }
`;

export const AltPoolRow = styled.div`
    position: relative;
`;

export const AltPoolTitle = styled.div`
    display: flex;
    flex-direction: row;
    color: #9ca3af;
    font-weight: 400;
    font-size: 16px;
    margin-bottom: 30px;

    &:before,
    &:after {
        content: '';
        flex: 1 1;
        border-bottom: 1px solid #9ca3af;
        margin: auto;
    }
    &:before {
        margin-right: 10px;
    }
    &:after {
        margin-left: 10px;
    }
`;

export const AltPoolActions = styled.div`
    display: block;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 20px;

    @media ${({ theme }) => theme.device.sm} {
        gap: 0;
        flex-direction: row;
    }
`;

export const DisabledButtonWrap = styled.div`
    cursor: not-allowed;
    opacity: 0.5;
    position: relative;
    @media ${({ theme }) => theme.device.sm} {
        margin-left: 1.25rem;
    }
`;

export const DummyButton = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: not-allowed;
`;

export const Button = styled(UnstyledButton)<{ disabled?: boolean }>`
    @media ${({ theme }) => theme.device.sm} {
        max-width: 220px;
    }

    ${({ disabled }) => {
        if (disabled) {
            return `
                cursor: not-allowed;
                pointer-events: none;
                z-index: -1;
            `;
        }
    }};
`;

export const NoResults = styled.div`
    padding: 60px 0px 80px;
    text-align: center;
    color: #9ca3af;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    margin: 0 auto;
    font-size: 24px;
    line-height: 32px;

    > span svg {
        height: 48px;
        width: 48px;
        margin-bottom: 8px;
    }
    > span svg path {
        fill: #6b7280;
    }
`;

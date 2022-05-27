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
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    background-color: ${({ theme }) => theme.background.primary};

    @media ${({ theme }) => theme.device.sm} {
        border-radius: 1rem;
    }
    @media ${({ theme }) => theme.device.md} {
        padding: 2rem 1rem;
        border-radius: 1.5rem;
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
    @media ${({ theme }) => theme.device.sm} {
        margin-left: 1.25rem;
    }
`;

export const Button = styled(UnstyledButton)<{ disabled?: boolean }>`
    @media ${({ theme }) => theme.device.sm} {
        max-width: 220px;
    }

    ${({ disabled }) => {
        if (disabled) {
            return `
                pointer-events: none;

            `;
        }
    }};
`;

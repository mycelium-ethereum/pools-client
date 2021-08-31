import styled from 'styled-components';

export const Button = styled.button<{ height?: 'medium' | 'small' | 'extra-small' }>`
    width: 160px;
    border: 1px solid var(--color-primary);
    border-radius: 10px;
    transition: 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: var(--color-primary);
    height: var(--height-${(props) => props.height as string}-button);
    cursor: pointer;

    &:hover {
        background: var(--color-primary);
        color: var(--color-text);
    }

    &:focus,
    &:active {
        outline: none;
        border: 1px solid var(--color-primary);
        border-radius: 10px;
    }

    &.primary {
        background: var(--color-primary);
        color: #fff;
    }

    &.primary:hover {
        background: var(--color-background);
        color: var(--color-primary);
    }

    &:disabled,
    &[disabled],
    .button-disabled {
        opacity: 0.5;
        cursor: not-allowed;

        &:hover {
            background: none;
            color: var(--color-text);
        }
    }
`;

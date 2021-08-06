import styled from 'styled-components';

export const Menu = styled.div`
    position: absolute;
    top: -1.5rem;
    left: -2rem;
    right: -3.5rem;
    padding: 1.5rem 0;
    opacity: 0;
    background: var(--color-accent);
    border-radius: 1rem;
    transform-origin: top center;
    transform: scale(0.7, 0);
    transition: all 500ms ease-in-out;
    z-index: 10;
`;

export const MenuItem = styled.div`
    border-bottom: 1px solid var(--color-primary);
    transition: all 400ms ease;
    padding-left: 2rem;

    &:not(:first-child) {
        opacity: 0;
        padding-left: 2rem;
    }
    &:first-child {
        height: 60px;
        opacity: 0;
    }
    > a {
        height: 60px;
        display: flex;
        align-items: center;
        padding-left: 2rem;
        transition: all 300ms ease;
    }
    &:first-child > a {
        padding-top: 0;
        opacity: 0;
    }
    &:not(:first-child) > a:hover {
        background: var(--color-primary);
    }
    &:last-child {
        padding: 0.5rem 2rem 0 2rem;
        border-bottom: none;
    }

    &.button-container {
        display: flex;
        justify-content: space-between;
    }
`;

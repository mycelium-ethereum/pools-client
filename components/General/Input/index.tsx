import styled from 'styled-components';

const errorStyles = `
    border-color: rgb(252 165 165)!important;
    color: rgb(239 68 68);
    &:focus-within {
        outline-color: rgb(239 68 68);
    }
`;

const warningStyles = `
    border-color: rgb(234 179 8)!important;
    color: rgb(202 138 4);
    &:focus-within {
        outline-color: rgb(202 138 4);
    }
`;

type Variation = 'warning' | 'error';

export const InputContainer = styled.div<{
    className?: string;
    variation?: Variation;
}>`
    position: relative;
    padding: 0.75rem;
    border-width: 1px;
    border-radius: 0.25rem;
    background: ${({ theme }) => theme['button-bg']};
    outline: 1px solid transparent;

    ${({ theme, variation }) => {
        switch (variation) {
            case 'error':
                return errorStyles;
            case 'warning':
                return warningStyles;
            default:
                return `
                    border-color: ${theme.border};
                    color: ${theme.text};
                    opacity: 0.8;
                    &:focus-within {
                        outline-color: ${theme.primary};
                    }

            `;
        }
    }}
`;

export const InnerInputText = styled.div`
    display flex;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    right: 1.25rem;
    height: 50%;
    color: ${({ theme }) => theme.primary};
`;

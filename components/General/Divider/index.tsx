import React from 'react';
import styled from 'styled-components';

type DProps = {
    text: string;
    className?: string;
};

const Divider = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    opacity: 0.5;
    color: var(--color-primary);
    &:not(:empty)::before {
        margin-right: 0.25em;
    }

    &:not(:empty)::after {
        margin-left: 0.25em;
    }
    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--color-primary);
    }
`;
export default styled(({ text, className }: DProps) => (
    <div className={className}>
        <Divider>{text}</Divider>
    </div>
))`
    margin: 0.5rem 0;
` as React.FC<DProps>;

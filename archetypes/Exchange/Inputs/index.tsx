import { Button } from '@components/General';
import styled from 'styled-components';
import { Select } from '@components/General/Input';

export const Label = styled.p`
    color: var(--color-text);
    margin-bottom: 0.5rem;
`;

export const InputContainer = styled.div`
    position: relative;
`;

export const ExchangeButton = styled(Button)`
    border-radius: 7px;
    height: 3.125rem;
    margin: 1rem auto;
    width: 100%;
`;

export const InputRow = styled.div`
    position: relative;
    margin: 1rem 0;
    &.markets {
        display: flex;
        justify-content: space-between;
    }
`;

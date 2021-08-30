import { Button } from '@components/General';
import styled from 'styled-components';

export const Label = styled.p`
    color: var(--color-text);
    margin-bottom: 0.5rem;
`;

export const InputContainer = styled.div`
    position: relative;
`;

export const ExchangeButton = styled(Button)`
    border-radius: 7px;
    height: 50px;
    margin: 1rem auto;
    width: 100%;
`;

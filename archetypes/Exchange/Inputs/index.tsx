import { Button } from '@components/General';
import { Select } from '@components/General/Input';
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

export const MarketSelect = styled(Select)`
    width: 285px;
    height: 3.44rem; // 55px
    padding: 13px 20px;

    @media (max-width: 611px) {
        width: 156px;
        height: 44px;
    }
`;

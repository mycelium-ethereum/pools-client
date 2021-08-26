import { Select } from '@components/General/Input';
import { Button } from '@components/General';
import styled from 'styled-components';

export const Label = styled.p`
    color: #fff;
`;

export const InputContainer = styled.div`
    margin: 0 1rem;
    position: relative;
    ${Select} {
        // width: 100%;
    }
`;

export const ExchangeButton = styled(Button)`
    border-radius: 11px;
    height: 48px;
    margin: 1rem auto;
`;

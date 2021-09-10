import { Select } from '@components/General/Input';
import styled from 'styled-components';

export const MarketSelect = styled(Select)`
    width: 285px;
    height: 3.44rem; // 55px
    padding: 13px 20px;

    @media (max-width: 611px) {
        width: 156px;
        height: 44px;
    }
`;

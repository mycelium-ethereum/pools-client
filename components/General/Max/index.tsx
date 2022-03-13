import { Theme } from '@context/ThemeContext/themes';
import styled from 'styled-components';

const Max = styled.div`
    cursor: pointer;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 16px;
    line-height: 150%;
    color: ${({ theme }) => (theme.theme === Theme.Light ? '#2A2AC7' : '#fff')};
    &:hover {
        text-decoration: underline;
    }
`;

export default Max;

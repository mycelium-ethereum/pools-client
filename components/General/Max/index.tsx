import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';

const Max = styled.div<{ disabled?: boolean }>`
    text-transform: uppercase;
    font-weight: bold;
    font-size: 16px;
    line-height: 150%;
    color: ${({ theme }) => (theme.theme === Theme.Light ? '#2A2AC7' : '#fff')};
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? '0.8' : '1')};

    &:hover {
        text-decoration: ${({ disabled }) => (disabled ? 'none' : 'underline')};
    }
`;

export default Max;

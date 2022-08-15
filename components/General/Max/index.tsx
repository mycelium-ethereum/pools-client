import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';

const Max = styled.div<{ disabled?: boolean }>`
    text-transform: uppercase;
    font-weight: bold;
    font-size: 14px;
    line-height: 150%;
    color: ${({ theme }) => (theme.theme === Theme.Light ? '#2A2AC7' : '#fff')};
    background-color: ${({ theme }) => theme.colors.primary};
    padding: 0.15rem 0.4rem;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? '0.8' : '1')};
    border-radius: 3px;

    &:hover {
        text-decoration: ${({ disabled }) => (disabled ? 'none' : 'underline')};
    }
`;

export default Max;

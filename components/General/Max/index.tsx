import styled from 'styled-components';

const Max = styled.div`
    cursor: pointer;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 16px;
    line-height: 150%;
    color: ${({ theme }) => (theme.isDark ? '#fff' : '#2A2AC7')};
    &:hover {
        text-decoration: underline;
    }
`;

export default Max;

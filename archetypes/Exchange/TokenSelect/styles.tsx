import { HiddenExpand, Logo } from '@components/General';
import { Table } from '@components/General/TWTable';
import styled from 'styled-components';
import { device } from '@context/ThemeContext/themes';
import { SearchInput } from '@components/General/SearchInput';

export const TokenSelectBox = styled.div`
    width: 100%;
    background: ${({ theme }) => theme['background-secondary']};
    height: 220px;
    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04);
    border-radius: 7px;
`;

export const TokenSelectDropdown = styled(HiddenExpand)`
    position: absolute;
    width: 100%;
    margin-top: 0.75rem !important;

    z-index: 3;

    // this is the margin of the parent modal
    padding: 0 1rem;
    margin-left: -1rem;

    @media ${device.sm} {
        padding: 0 4rem;
        margin-left: -4rem;
    }
`;

export const TokenLogo = styled(Logo)`
    display: inline-block;
    margin-right: 0.25rem;
`;

export const LogoCell = styled.div`
    display: flex;
    align-items: center;
    text-align: left;
`;

export const LogoText = styled.div`
    font-weight: 700;
`;

export const LogoSubtext = styled.div``;

export const TextWrapper = styled.div``;

export const TokenSearch = styled(SearchInput)`
    > input {
        padding: 0.75rem 1rem 0.75rem 2.5rem !important;
    }
`;

// TABLE
export const TokenSelectTable = styled(Table)`
    width: 100%;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
    font-weight: 600;
    font-size: 14px;
`;

export const TokenSelectRow = styled.tr`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    padding: 0.6rem;
    td {
        position: relative;
    }
    td:not(:last-child):after {
        content: '';
        position: absolute;
        top: 10px;
        right: 0;
        height: 40%;
        width: 1px;
        background: ${({ theme }) => (theme.isDark ? '#F9FAFB' : '#E5E7EB')};
    }
`;

export const TokenSelectHead = styled.thead`
    background-color: ${({ theme }) => theme['border-secondary']};
    padding: 1rem;
    text-align: center;
    border-radius: 7px;
`;

export const HeaderCell = styled.th`
    position: relative;
    &:not(:last-child):after {
        content: '';
        position: absolute;
        top: 4px;
        right: 0;
        height: 70%;
        width: 1px;
        background: ${({ theme }) => (theme.isDark ? '' : theme.text)};
    }
`;

export const TokenSelectBody = styled.tbody`
    background-color: ${({ theme }) => (theme.isDark ? theme['button-bg'] : theme.backgroud)};
`;

interface TokenSelectCell {
    hasLogo?: boolean;
    hasBalance?: boolean;
}
export const TokenSelectCell = styled.td<TokenSelectCell>`
    display: flex;
    flex-direction: ${({ hasBalance }) => (hasBalance ? 'column' : 'row')};
    justify-content: ${({ hasLogo }) => (hasLogo ? 'flex-start' : 'center')};
    align-items: center;
    font-size: 12px;
    svg {
        margin-right: 10px;
    }
    span {
        color: #6b7280;
    }
    @media (${device.sm}) {
        font-size: 14px;
    }
`;

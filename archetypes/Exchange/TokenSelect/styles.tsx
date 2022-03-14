import { HiddenExpand, Logo } from '@components/General';
import { Table } from '@components/General/TWTable';
import styled from 'styled-components';
import { device } from '@context/ThemeContext/themes';
import { InnerSearchInput, InputWrapper } from '@components/General/SearchInput';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';

export const TokenSelectBox = styled.div`
    width: 100%;
    background: ${({ theme }) => theme['background-secondary']};
    height: 220px;
    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04);
    border-radius: 7px;
    overflow: hidden;
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

export const SearchWrap = styled(InputWrapper)`
    opacity: 0.8;
    border-radius: 7px;
`;

export const TokenSearch = styled(InnerSearchInput)<{
    show: boolean;
}>`
    padding: 0.75rem 2.5rem 0.75rem 1rem !important;
    display: ${({ show }) => (show ? 'block' : 'none')};
`;

export const SelectedToken = styled.div<{
    show: boolean;
}>`
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    display: ${({ show }) => (show ? 'block' : 'none')};
`;

export const IconWrap = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    height: 100%;
    right: 0.75rem;
    padding-top: 0.25rem;
    pointer-events: none;
`;

export const SearchIcon = styled(SearchOutlined)`
    height: 1.25rem;
    width: 1.25rem;

    // text-gray-400
    color: rgb(156 163 175);
`;

export const DownArrow = styled(DownOutlined)`
    height: 1.25rem;
    width: 1.25rem;

    // text-gray-400
    color: rgb(156 163 175);
`;

// TABLE
export const TokenSelectTable = styled(Table)`
    width: 100%;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
    font-weight: 600;
    font-size: 14px;
`;

export const TokenSelectRow = styled.tr<{
    header?: boolean;
}>`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    padding: 0.6rem;
    cursor: pointer;

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

    &:hover {
        ${({ header }) => (!header ? 'opacity: 0.8' : '')};
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
